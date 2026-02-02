"use client";

import { useEffect, useState } from "react";
import { Search, Download, Plus, Eye } from "lucide-react";
import { getManifestacoes, getSecretarias, ManifestacaoListItem } from "@/app/actions/manifestacoes";
import Image from "next/image";
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
    "ELOGIO": "#10B981",
    "SUGESTAO": "#F59E0B",
    "RECLAMACAO": "#F97316",
    "DENUNCIA": "#334155",
    "INFORMACAO": "#0EA5E9",
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
    // Format: ***.456.***-**
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) return "***.***.***-**";
    return `***.${cleaned.substring(3, 6)}.***-**`;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
}

export default function ManifestacoesPage() {
    const [manifestacoes, setManifestacoes] = useState<ManifestacaoListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [tipo, setTipo] = useState("TODOS");
    const [secretaria, setSecretaria] = useState("TODAS");
    const [identidade, setIdentidade] = useState("TODOS");
    const [periodo, setPeriodo] = useState("30DIAS");

    // Available secretarias
    const [secretarias, setSecretarias] = useState<string[]>([]);

    useEffect(() => {
        async function loadSecretarias() {
            const secs = await getSecretarias();
            setSecretarias(secs);
        }
        loadSecretarias();
    }, []);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const result = await getManifestacoes(
                {
                    search,
                    tipo,
                    secretaria,
                    identidade,
                    periodo,
                },
                page,
                10
            );
            setManifestacoes(result.data);
            setTotal(result.total);
            setTotalPages(result.totalPages);
            setLoading(false);
        }
        loadData();
    }, [search, tipo, secretaria, identidade, periodo, page]);

    const perPage = 10;
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 py-8 px-6">
            {/* Header */}
            <header className="flex flex-col items-center gap-4 mb-8">
                <div className="flex flex-col items-center">
                    <Image
                        src="/logo-boituva.png"
                        alt="Boituva"
                        width={400}
                        height={120}
                        priority
                        className="h-20 w-auto mb-2"
                    />
                    <p className="text-grafite/50 text-xs font-semibold tracking-[0.3em]">OUVIDORIA DIGITAL</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {/* Title and Actions */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-grafite flex items-center gap-2">
                        <span className="text-2xl">📋</span> Manifestações Recentes
                    </h1>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border-2 border-grafite text-grafite rounded-lg font-semibold hover:bg-grafite hover:text-white transition-colors">
                            <Download className="w-5 h-5" />
                            Exportar
                        </button>
                        <Link
                            href="/registro/identificacao"
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Nova Manifestação
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-[24px] shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-grafite mb-2">Buscar</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por CPF, Nome ou ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-semibold text-grafite mb-2">Tipo</label>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary outline-none transition-colors"
                            >
                                {TIPO_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Secretaria */}
                        <div>
                            <label className="block text-sm font-semibold text-grafite mb-2">Secretaria</label>
                            <select
                                value={secretaria}
                                onChange={(e) => setSecretaria(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary outline-none transition-colors"
                            >
                                <option value="TODAS">Todas</option>
                                {secretarias.map(sec => (
                                    <option key={sec} value={sec}>{sec}</option>
                                ))}
                            </select>
                        </div>

                        {/* Identidade */}
                        <div>
                            <label className="block text-sm font-semibold text-grafite mb-2">Identidade</label>
                            <select
                                value={identidade}
                                onChange={(e) => setIdentidade(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary outline-none transition-colors"
                            >
                                {IDENTIDADE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Período */}
                        <div>
                            <label className="block text-sm font-semibold text-grafite mb-2">Período</label>
                            <select
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}
                                className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-primary outline-none transition-colors"
                            >
                                {PERIODO_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[24px] shadow-lg overflow-hidden mb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b-2 border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-grafite/60 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-grafite/60 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-grafite/60 uppercase tracking-wider">Cidadão</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-grafite/60 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-grafite/60 uppercase tracking-wider">Secretaria</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-grafite/60 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-grafite/60 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {manifestacoes.map((item, index) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <Link href={`/consulta?protocolo=${item.protocolo}`} className="text-primary font-semibold hover:underline">
                                                    #{item.protocolo}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-grafite/80">{formatDate(item.created_at)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                        style={{ backgroundColor: item.nome_cidadao ? "#0EA5E9" : "#64748b" }}
                                                    >
                                                        {getInitials(item.nome_cidadao)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-grafite">{item.nome_cidadao || "Anônimo"}</div>
                                                        <div className="text-xs text-grafite/50">{maskCPF(item.cpf)}</div>
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
                                            <td className="px-6 py-4 text-grafite/80">{item.secretaria}</td>
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
                                                <button
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Ver detalhes"
                                                >
                                                    <Eye className="w-5 h-5 text-grafite/60" />
                                                </button>
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
                    <div className="bg-white rounded-[24px] shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-grafite/60">
                                Mostrando <span className="font-semibold text-grafite">{start}</span> a{" "}
                                <span className="font-semibold text-grafite">{end}</span> de{" "}
                                <span className="font-semibold text-grafite">{total}</span> resultados
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border-2 border-slate-200 rounded-lg font-semibold text-grafite disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                >
                                    ‹
                                </button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Show first 3, last 3, and current +/- 1
                                    if (pageNum <= 3 || pageNum > totalPages - 3 || Math.abs(pageNum - page) <= 1) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`px-4 py-2 border-2 rounded-lg font-semibold transition-colors ${page === pageNum
                                                    ? "bg-primary text-white border-primary"
                                                    : "border-slate-200 text-grafite hover:bg-slate-50"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (pageNum === 4 && page > 5) {
                                        return <span key={pageNum} className="px-2 py-2">...</span>;
                                    } else if (pageNum === totalPages - 3 && page < totalPages - 4) {
                                        return <span key={pageNum} className="px-2 py-2">...</span>;
                                    }
                                    return null;
                                })}
                                <button
                                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border-2 border-slate-200 rounded-lg font-semibold text-grafite disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                >
                                    ›
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <footer className="mt-8 text-center">
                    <Link
                        href="/transparencia"
                        className="inline-block bg-grafite text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-grafite/90 transition-colors"
                    >
                        Voltar à Transparência
                    </Link>
                </footer>
            </div>
        </main>
    );
}
