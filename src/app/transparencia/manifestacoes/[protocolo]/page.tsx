"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { getManifestacaoByProtocolo, updateManifestacaoStatus, sendManifestacaoResponse } from "@/app/actions/manifestacoes";

/* --------------------------------------------------------------------------------
   Constants & Colors
--------------------------------------------------------------------------------  */
const TIPO_COLORS: Record<string, string> = {
    "ELOGIO": "#10B981",    // Green
    "SUGESTAO": "#F59E0B",   // Amber
    "RECLAMACAO": "#F97316", // Orange
    "DENUNCIA": "#334155",   // Slate
    "INFORMACAO": "#0EA5E9", // Blue
    "OUTROS": "#64748b",
};

const STATUS_OPTIONS = [
    { value: "PENDENTE", label: "Pendente" },
    { value: "EM_ANALISE", label: "Em Análise" },
    { value: "CONCLUIDO", label: "Concluído" },
    { value: "ARQUIVADO", label: "Arquivado" },
];

/* --------------------------------------------------------------------------------
   Utility Functions
--------------------------------------------------------------------------------  */
function maskCPF(cpf: string | null): string {
    if (!cpf) return "***.***.***-**";
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) return "***.***.***-**";
    return `***.${cleaned.substring(3, 6)}.***-**`;
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString("pt-BR", {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getInitials(name: string | null): string {
    if (!name) return "A";
    const parts = name.split(" ");
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();
}

/* --------------------------------------------------------------------------------
   Component
--------------------------------------------------------------------------------  */
export default function ManifestacaoDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const protocoloParam = params.protocolo as string;

    const [manifestacao, setManifestacao] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [resposta, setResposta] = useState("");
    const [notas, setNotas] = useState("");

    // Loading states for actions
    const [isSaving, setIsSaving] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);

    useEffect(() => {
        async function loadData() {
            if (!protocoloParam) return;
            setLoading(true);
            const data = await getManifestacaoByProtocolo(protocoloParam);
            if (data) {
                setManifestacao(data);
                setStatus(data.status);
                setResposta(data.resposta_oficial || "");
                setNotas(data.notas_internas || "");
            }
            setLoading(false);
        }
        loadData();
    }, [protocoloParam]);

    /* --------------------------------------------------------------------------------
       Handlers
    --------------------------------------------------------------------------------  */
    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus);
        // Optimistic update - actually save to DB
        await updateManifestacaoStatus(manifestacao.id, newStatus);
    };

    const handleSendResponse = async () => {
        if (!manifestacao) return;
        setIsSaving(true);
        try {
            await sendManifestacaoResponse(manifestacao.id, resposta, notas, status);
            // Reload data to confirm
            const updated = await getManifestacaoByProtocolo(protocoloParam);
            setManifestacao(updated);
            alert("Resposta enviada com sucesso!");
        } catch (error) {
            alert("Erro ao enviar resposta.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFinish = async () => {
        if (!manifestacao) return;
        const confirmed = confirm("Tem certeza que deseja finalizar este atendimento?");
        if (!confirmed) return;

        setIsFinishing(true);
        try {
            await sendManifestacaoResponse(manifestacao.id, resposta, notas, "CONCLUIDO");
            setStatus("CONCLUIDO");
            alert("Atendimento finalizado com sucesso!");
        } catch (error) {
            alert("Erro ao finalizar.");
        } finally {
            setIsFinishing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!manifestacao) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <AlertCircle className="w-16 h-16 text-red-500" />
                <h1 className="text-2xl font-bold text-grafite">Manifestação não encontrada</h1>
                <Link href="/transparencia/manifestacoes" className="text-primary hover:underline">
                    Voltar para a lista
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 py-8 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Back Button */}
                <Link
                    href="/transparencia/manifestacoes"
                    className="flex items-center gap-2 text-grafite/60 hover:text-primary mb-6 transition-colors w-fit"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar para a lista
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN (2/3) - Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                                        #{manifestacao.protocolo}
                                        <span className={`text-sm px-3 py-1 rounded-full text-white font-medium bg-secondary`}
                                            style={{ backgroundColor: status === "EM_ANALISE" || status === "PENDENTE" ? "#0EA5E9" : (status === "CONCLUIDO" ? "#10B981" : "#64748b") }}
                                        >
                                            {status.replace("_", " ")}
                                        </span>
                                    </h1>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Protocolado em {formatDate(manifestacao.created_at)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span
                                        className="px-4 py-2 rounded-lg font-bold text-white shadow-sm flex items-center gap-2"
                                        style={{ backgroundColor: TIPO_COLORS[manifestacao.tipo] || "#64748b" }}
                                    >
                                        {manifestacao.tipo}
                                    </span>
                                    <span className="px-4 py-2 rounded-lg bg-slate-100 text-grafite font-medium border border-slate-200">
                                        {manifestacao.secretaria}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Citizen Data Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-grafite flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Dados do Cidadão
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${manifestacao.nome_cidadao ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                    }`}>
                                    {manifestacao.nome_cidadao ? "Identificado" : "Anônimo"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Nome Completo</label>
                                    <p className="text-grafite font-medium text-lg">{manifestacao.nome_cidadao || "Anônimo"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">CPF / Contato</label>
                                    <p className="text-grafite font-medium text-lg">{manifestacao.cpf ? maskCPF(manifestacao.cpf) : "-"}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Local da Ocorrência</label>
                                    <div className="flex items-center gap-2 text-grafite bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        {manifestacao.bairro || "Endereço não informado"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Report Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                            <h2 className="text-xl font-bold text-grafite mb-4 flex items-center gap-2">
                                <span className="text-2xl">📝</span> Relato do Cidadão
                            </h2>
                            <div className="prose prose-slate max-w-none text-grafite/80 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                                {manifestacao.relato}
                            </div>
                        </div>

                        {/* History Card (Visual only for now) */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
                            <h2 className="text-xs font-bold text-slate-400 uppercase mb-4">Histórico Recente</h2>
                            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pl-6 py-2">
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                                    <p className="text-xs text-slate-400 mb-1">Hoje, 10:00</p>
                                    <p className="text-grafite font-medium">Situação atual: {status.replace("_", " ")}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm"></div>
                                    <p className="text-xs text-slate-400 mb-1">{formatDate(manifestacao.created_at)}</p>
                                    <p className="text-grafite font-medium">Manifestação recebida</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN (1/3) - Actions */}
                    <div className="space-y-6">

                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 sticky top-6">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <span className="text-blue-500 font-bold">💎</span>
                                </div>
                                <h2 className="font-bold text-grafite">Ações do Ouvidor</h2>
                            </div>

                            {/* Change Status */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Alterar Status</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-grafite py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium transition-all cursor-pointer"
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Response */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Resposta Oficial</label>
                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">(Visível ao cidadão)</span>
                                </div>
                                <textarea
                                    value={resposta}
                                    onChange={(e) => setResposta(e.target.value)}
                                    placeholder="Escreva a resposta oficial aqui..."
                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-grafite focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                                />
                            </div>

                            {/* Internal Notes */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Notas Internas</label>
                                    <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        🔒 Privado
                                    </span>
                                </div>
                                <textarea
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                    placeholder="Anotações para a equipe interna..."
                                    className="w-full h-24 bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-grafite focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 resize-none transition-all"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleSendResponse}
                                    disabled={isSaving}
                                    className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-200"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    Enviar Resposta
                                </button>

                                <button
                                    onClick={handleFinish}
                                    disabled={isFinishing}
                                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isFinishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                    Finalizar Atendimento
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
