"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, Eye } from "lucide-react";
import { getManifestacoes, getSecretarias, ManifestacaoListItem } from "@/app/actions/manifestacoes";
import Link from "next/link";
import { motion } from "framer-motion";

const TIPO_OPTIONS = [
    { value: "TODOS", label: "Todos" },
    { value: "ELOGIO", label: "Elogio" },
    { value: "SUGESTAO", label: "Sugestão" },
    { value: "RECLAMACAO", label: "Reclamação" },
    { value: "DENUNCIA", label: "Denúncia" },
    { value: "INFORMACAO", label: "Informação" },
];

const IDENTIDADE_OPTIONS = [
    { value: "TODOS", label: "Todos" },
    { value: "IDENTIFICADO", label: "Identificado" },
    { value: "ANONIMO", label: "Anônimo" },
];

const PERIODO_OPTIONS = [
    { value: "30DIAS", label: "Últimos 30 dias" },
    { value: "7DIAS", label: "Últimos 7 dias" },
    { value: "ANO", label: "Último ano" },
    { value: "TOTAL", label: "Total" },
];

const TIPO_COLORS: Record<string, string> = {
    "elogio": "#10B981",
    "sugestao": "#F59E0B",
    "reclamacao": "#F97316",
    "denuncia": "#EF4444",
    "informacao": "#0EA5E9",
};

const STATUS_COLORS: Record<string, string> = {
    "CONCLUIDO": "#10B981",
    "EM_ANALISE": "#0EA5E9",
    "PENDENTE": "#F59E0B",
    "ARQUIVADO": "#64748b",
};

function getInitials(name: string | null): string {
    if (!name) return "A"; // Anônimo
    const parts = name.split(" ");
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

function maskCPF(cpf: string | null): string {
    if (!cpf) return "***.***.***-**";
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) return "***.***.***-**";
    return `***.${cleaned.substring(3, 6)}.***-**`;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
}

export function ManifestacoesTab() {
    const [page, setPage] = useState(1);

    // Filters
    const [search, setSearch] = useState("");
    const [tipo, setTipo] = useState("TODOS");
    const [secretaria, setSecretaria] = useState("TODAS");
    const [identidade, setIdentidade] = useState("TODOS");
    const [periodo, setPeriodo] = useState("30DIAS");

    // Query para secretarias
    const { data: secretarias = [] } = useQuery({
        queryKey: ['secretarias'],
        queryFn: getSecretarias,
        staleTime: 10 * 60 * 1000, // 10 minutos
    });

    // Query para manifestações
    const { data: result, isLoading: loading } = useQuery({
        queryKey: ['manifestacoes', search, tipo, secretaria, identidade, periodo, page],
        queryFn: () => getManifestacoes({ search, tipo, secretaria, identidade, periodo }, page, 10),
        staleTime: 2 * 60 * 1000, // 2 minutos
    });

    const manifestacoes = result?.data ?? [];
    const total = result?.total ?? 0;
    const totalPages = result?.totalPages ?? 0;

    const perPage = 10;
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);

    return (
        <div className="max-w-7xl mx-auto pt-6 px-6">
            {/* Title and Actions */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    📋 Manifestações Recentes
                </h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border-2 border-text-primary text-text-primary rounded-lg font-semibold hover:bg-text-primary hover:text-bg-card transition-colors">
                        <Download className="w-5 h-5" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-bg-card rounded-[24px] shadow-lg p-6 mb-6 border border-border-color">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-text-primary mb-2">Buscar</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                            <input
                                type="text"
                                placeholder="Buscar por CPF, Nome ou ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-bg-secondary border-2 border-border-color text-text-primary rounded-lg focus:border-primary outline-none transition-colors placeholder:text-text-secondary/50"
                            />
                        </div>
                    </div>

                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">Tipo</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full px-4 py-2 bg-bg-secondary border-2 border-border-color text-text-primary rounded-lg focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
                        >
                            {TIPO_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Secretaria */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">Secretaria</label>
                        <select
                            value={secretaria}
                            onChange={(e) => setSecretaria(e.target.value)}
                            className="w-full px-4 py-2 bg-bg-secondary border-2 border-border-color text-text-primary rounded-lg focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
                        >
                            <option value="TODAS">Todas</option>
                            {secretarias.map(sec => (
                                <option key={sec} value={sec}>{sec}</option>
                            ))}
                        </select>
                    </div>

                    {/* Identidade */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">Identidade</label>
                        <select
                            value={identidade}
                            onChange={(e) => setIdentidade(e.target.value)}
                            className="w-full px-4 py-2 bg-bg-secondary border-2 border-border-color text-text-primary rounded-lg focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
                        >
                            {IDENTIDADE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Período */}
                    <div>
                        <label className="block text-sm font-semibold text-text-primary mb-2">Período</label>
                        <select
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="w-full px-4 py-2 bg-bg-secondary border-2 border-border-color text-text-primary rounded-lg focus:border-primary outline-none transition-colors appearance-none cursor-pointer"
                        >
                            {PERIODO_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-bg-card rounded-[24px] shadow-lg overflow-hidden mb-6 border border-border-color">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-bg-secondary border-b-2 border-border-color">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Data</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Cidadão</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Secretaria</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-text-secondary uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {manifestacoes.map((item, index) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-bg-secondary transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <Link href={`/consulta?protocolo=${item.protocolo}`} className="text-primary font-semibold hover:underline">
                                                #{item.protocolo}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-text-primary/80">{formatDate(item.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                    style={{ backgroundColor: item.nome_cidadao ? "#0EA5E9" : "#64748b" }}
                                                >
                                                    {getInitials(item.nome_cidadao)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-text-primary">{item.nome_cidadao || "Anônimo"}</div>
                                                    <div className="text-xs text-text-secondary">{maskCPF(item.cpf)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                                                style={{ backgroundColor: TIPO_COLORS[item.tipo] || "#64748b" }}
                                            >
                                                {item.tipo.charAt(0) + item.tipo.slice(1).toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-text-primary/80">{item.secretaria}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="px-3 py-1 rounded-full text-white text-sm font-semibold flex items-center gap-1 w-fit"
                                                style={{ backgroundColor: STATUS_COLORS[item.status] || "#64748b" }}
                                            >
                                                <span className="w-2 h-2 rounded-full bg-white/80"></span>
                                                {item.status.replace("_", " ").charAt(0) + item.status.replace("_", " ").slice(1).toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Link
                                                href={`/transparencia/manifestacoes/${item.protocolo}`}
                                                className="p-2 hover:bg-bg-secondary rounded-lg transition-colors inline-block"
                                                title="Ver detalhes"
                                            >
                                                <Eye className="w-5 h-5 text-text-secondary" />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="bg-bg-card rounded-[24px] shadow-lg p-6 mb-6 border border-border-color">
                    <div className="flex items-center justify-between">
                        <p className="text-text-secondary">
                            Mostrando <span className="font-semibold text-text-primary">{start}</span> a{" "}
                            <span className="font-semibold text-text-primary">{end}</span> de{" "}
                            <span className="font-semibold text-text-primary">{total}</span> resultados
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border-2 border-border-color rounded-lg font-semibold text-text-primary disabled:opacity-30 hover:bg-bg-secondary transition-colors"
                            >
                                ‹
                            </button>
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (pageNum <= 3 || pageNum > totalPages - 3 || Math.abs(pageNum - page) <= 1) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-4 py-2 border-2 rounded-lg font-semibold transition-colors ${page === pageNum
                                                ? "bg-primary text-white border-primary"
                                                : "border-border-color text-text-primary hover:bg-bg-secondary"
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (pageNum === 4 && page > 5) {
                                    return <span key={pageNum} className="px-2 py-2 text-text-secondary">...</span>;
                                } else if (pageNum === totalPages - 3 && page < totalPages - 4) {
                                    return <span key={pageNum} className="px-2 py-2 text-text-secondary">...</span>;
                                }
                                return null;
                            })}
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border-2 border-border-color rounded-lg font-semibold text-text-primary disabled:opacity-30 hover:bg-bg-secondary transition-colors"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
