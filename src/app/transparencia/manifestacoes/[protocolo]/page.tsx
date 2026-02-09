"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { User, MapPin, Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

import { getManifestacaoByProtocolo, updateManifestacaoStatus, sendManifestacaoResponse } from "@/app/actions/manifestacoes";
import { ChatMensagens } from "@/components/ChatMensagens";
import { getMensagens, enviarMensagemOuvidor, finalizarManifestacaoOuvidor, TipoMensagem } from "@/app/actions/mensagens";

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
    { value: "EM_ANALISE", label: "Análise" },
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
    const queryClient = useQueryClient();
    const protocoloParam = params.protocolo as string;

    const [status, setStatus] = useState("");

    // Loading states for actions
    const [isSaving, setIsSaving] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);

    // Query para manifestação
    const { data: manifestacao, isLoading: loading } = useQuery({
        queryKey: ['manifestacao', protocoloParam],
        queryFn: () => getManifestacaoByProtocolo(protocoloParam),
        enabled: !!protocoloParam,
        staleTime: 2 * 60 * 1000,
    });

    // Query para mensagens (depende do ID da manifestação)
    const { data: mensagens = [], isLoading: loadingMensagens, refetch: refetchMensagens } = useQuery({
        queryKey: ['mensagens', manifestacao?.id],
        queryFn: () => getMensagens(manifestacao!.id, 'OUVIDOR'),
        enabled: !!manifestacao?.id,
        staleTime: 30 * 1000, // 30 segundos
    });

    // Sincronizar status quando manifestação carregar
    useEffect(() => {
        if (manifestacao?.status) {
            setStatus(manifestacao.status);
        }
    }, [manifestacao?.status]);

    /* --------------------------------------------------------------------------------
       Handlers
    --------------------------------------------------------------------------------  */
    const handleStatusChange = async (newStatus: string) => {
        if (!manifestacao) return;
        setStatus(newStatus);
        await updateManifestacaoStatus(manifestacao.id, newStatus);
    };

    const handleEnviarMensagem = async (conteudo: string, tipo: TipoMensagem) => {
        if (!manifestacao) return;
        if (tipo === 'CIDADAO') return;

        await enviarMensagemOuvidor(manifestacao.id, conteudo, tipo);
        await refetchMensagens();
    };

    const handleFinish = async () => {
        if (!manifestacao) return;
        const confirmed = confirm("Tem certeza que deseja finalizar este atendimento?");
        if (!confirmed) return;

        setIsFinishing(true);
        try {
            await finalizarManifestacaoOuvidor(manifestacao.id);
            setStatus("CONCLUIDO");
            await refetchMensagens();
            alert("Atendimento finalizado com sucesso!");
        } catch (error: any) {
            console.error(error);
            alert("Erro ao finalizar: " + (error.message || "Erro desconhecido"));
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

    const isReadOnly = status === 'CONCLUIDO' || status === 'ARQUIVADO';

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar backHref="/transparencia" />

            <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN (2/3) - Details */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* ... Header e Dados cards mantidos ... */}
                        {/* Estou omitindo linhas não alteradas para focar no fluxo, mas o replace precisa de contexto.
                           Vou usar o StartLine adequadamente. */}

                        {/* Como o replace deve ser preciso, vou focar apenas no componente Chat e handleFinish. 
                           O handleFinish já está acima. Abaixo vou encontrar onde o Chat é renderizado para passar readOnly. */}


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

                            {/* Chat Integration */}
                            <div className="mb-6">
                                <ChatMensagens
                                    mensagens={mensagens}
                                    onEnviar={handleEnviarMensagem}
                                    tipoUsuario="OUVIDOR"
                                    loading={loadingMensagens}
                                    readOnly={isReadOnly}
                                />
                            </div>



                            <div className="space-y-3 pt-2">


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
