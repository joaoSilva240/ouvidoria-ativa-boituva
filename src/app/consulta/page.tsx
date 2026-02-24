"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { ManifestacaoListItem } from "@/components/ManifestacaoListItem";
import { Search, Loader2, ArrowRight, AlertCircle, Calendar, Megaphone, Building2, Clock, CheckCircle, FileText, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "@/contexts/HistoryContext";
import { getManifestacaoByProtocol, saveSatisfacaoResposta, getMinhasManifestacoesAction, MinhaManifestacao } from "@/app/actions/consulta";
import { getMensagens, enviarMensagemCidadao, finalizarManifestacaoCidadao, TipoMensagem } from "@/app/actions/mensagens";
import { ChatMensagens } from "@/components/ChatMensagens";
import { SentimentWidget, HumorType } from "@/components/SentimentWidget";

const TIPO_LABELS: Record<string, string> = {
    "ELOGIO": "Elogio",
    "SUGESTAO": "Sugestão",
    "RECLAMACAO": "Reclamação",
    "DENUNCIA": "Denúncia",
    "INFORMACAO": "Solicitação",
    "OUTROS": "Outros",
};

export default function ConsultaPage() {
    // Estado da busca por protocolo
    const [protocolo, setProtocolo] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [satisfacao, setSatisfacao] = useState<HumorType>(null);
    const [satisfacaoSalva, setSatisfacaoSalva] = useState(false);
    const [salvandoSatisfacao, setSalvandoSatisfacao] = useState(false);

    // Estado da lista de manifestações do cidadão
    const [minhasManifestacoes, setMinhasManifestacoes] = useState<MinhaManifestacao[]>([]);
    const [loadingMinhas, setLoadingMinhas] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filteredManifestacoes, setFilteredManifestacoes] = useState<MinhaManifestacao[]>([]);

    // Chat state
    const [mensagens, setMensagens] = useState<any[]>([]);
    const [loadingMensagens, setLoadingMensagens] = useState(false);

    // Hooks
    const router = useRouter();
    const { addToHistory } = useHistory();

    // Carregar manifestações do cidadão ao montar
    useEffect(() => {
        async function fetchMinhas() {
            setLoadingMinhas(true);
            const response = await getMinhasManifestacoesAction();
            if (response.success && response.data) {
                setMinhasManifestacoes(response.data);
                setFilteredManifestacoes(response.data);
            }
            setLoadingMinhas(false);
        }
        fetchMinhas();
    }, []);

    // Filtrar lista quando protocolo mudar
    useEffect(() => {
        if (!protocolo.trim()) {
            setFilteredManifestacoes(minhasManifestacoes);
        } else {
            const filtered = minhasManifestacoes.filter((m) =>
                m.protocolo.toLowerCase().includes(protocolo.toLowerCase())
            );
            setFilteredManifestacoes(filtered);
        }
    }, [protocolo, minhasManifestacoes]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setResult(null);

        if (!protocolo || protocolo.length < 8) {
            setError("Por favor, digite um protocolo válido.");
            return;
        }

        setLoading(true);
        const response = await getManifestacaoByProtocol(protocolo);
        setLoading(false);

        if (response.success && response.data) {
            setResult(response.data);
            setSelectedId(response.data.id);

            if (response.data.protocolo && response.data.tipo) {
                addToHistory(response.data.protocolo, response.data.tipo);
            }

            if (response.data.satisfacao_resposta) {
                setSatisfacao(response.data.satisfacao_resposta as HumorType);
                setSatisfacaoSalva(true);
            } else {
                setSatisfacao(null);
                setSatisfacaoSalva(false);
            }

            // Carregar mensagens
            setLoadingMensagens(true);
            try {
                const msgs = await getMensagens(response.data.id, "CIDADAO");
                setMensagens(msgs);
            } catch (err) {
                console.error("Erro ao carregar mensagens", err);
            } finally {
                setLoadingMensagens(false);
            }
        } else {
            setError(response.error || "Manifestação não encontrada.");
        }
    };

    const handleSelectManifestacao = async (manifestacao: MinhaManifestacao) => {
        setSelectedId(manifestacao.id);
        setProtocolo(manifestacao.protocolo);
        setError("");
        setResult(null);

        setLoading(true);
        const response = await getManifestacaoByProtocol(manifestacao.protocolo);
        setLoading(false);

        if (response.success && response.data) {
            setResult(response.data);

            if (response.data.satisfacao_resposta) {
                setSatisfacao(response.data.satisfacao_resposta as HumorType);
                setSatisfacaoSalva(true);
            } else {
                setSatisfacao(null);
                setSatisfacaoSalva(false);
            }

            setLoadingMensagens(true);
            try {
                const msgs = await getMensagens(response.data.id, "CIDADAO");
                setMensagens(msgs);
            } catch (err) {
                console.error("Erro ao carregar mensagens", err);
            } finally {
                setLoadingMensagens(false);
            }
        }
    };

    const handleSatisfacaoChange = async (humor: HumorType) => {
        if (!result || satisfacaoSalva || !humor) return;

        setSatisfacao(humor);
        setSalvandoSatisfacao(true);

        const response = await saveSatisfacaoResposta(result.protocolo, humor);

        setSalvandoSatisfacao(false);

        if (response.success) {
            setSatisfacaoSalva(true);
        }
    };

    const handleEnviarMensagem = async (conteudo: string, tipo: TipoMensagem) => {
        if (!result) return;

        await enviarMensagemCidadao(result.protocolo, conteudo);

        const msgs = await getMensagens(result.id, "CIDADAO");
        setMensagens(msgs);
    };

    const handleFinalizar = async () => {
        if (!result) return;
        if (!confirm("Deseja encerrar esta manifestação? Isso confirmará que seu problema foi resolvido ou esclarecido.")) return;

        try {
            await finalizarManifestacaoCidadao(result.protocolo);
            // Recarregar detalhes
            const response = await getManifestacaoByProtocol(result.protocolo);
            if (response.success && response.data) {
                setResult(response.data);
            }
            alert("Manifestação finalizada com sucesso. Obrigado!");
        } catch (error) {
            console.error(error);
            alert("Não foi possível finalizar a manifestação.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDENTE": return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50";
            case "EM_ANALISE": return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50";
            case "CONCLUIDO": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50";
            default: return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDENTE": return "Pendente";
            case "EM_ANALISE": return "Em Análise";
            case "CONCLUIDO": return "Concluído";
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary font-sans text-text-primary flex flex-col transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex flex-col pt-16 px-4 md:px-8">
                {/* Header Compacto */}
                <div className="py-4 mb-4">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-bold text-text-primary"
                    >
                        Minhas Manifestações
                    </motion.h1>
                </div>

                {/* Split View Container */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 pb-8">
                    {/* Coluna Esquerda - Lista */}
                    <div className="w-full lg:w-1/4 flex flex-col">
                        {/* Barra de Pesquisa Compacta */}
                        <motion.form
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleSearch}
                            className="w-full relative mb-4"
                        >
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                                <input
                                    type="text"
                                    value={protocolo}
                                    onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
                                    placeholder="Buscar por protocolo..."
                                    className="w-full h-14 rounded-xl border-2 border-border-color bg-bg-card pl-12 pr-14 text-lg font-medium text-text-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-primary transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-primary/90 transition-colors disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                </button>
                            </div>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-8 left-0 w-full flex items-center gap-2 text-red-500 text-sm font-medium"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}
                        </motion.form>

                        {/* Lista de Manifestações */}
                        <div className="flex-1 bg-bg-card rounded-2xl border border-border-color overflow-hidden">
                            <div className="p-4 border-b border-border-color">
                                <h2 className="font-bold text-text-primary flex items-center gap-2">
                                    <Inbox className="w-5 h-5 text-primary" />
                                    Suas Manifestações
                                    <span className="ml-auto text-sm text-text-secondary font-normal">
                                        {filteredManifestacoes.length} {filteredManifestacoes.length === 1 ? "registro" : "registros"}
                                    </span>
                                </h2>
                            </div>

                            <div className="p-3 space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto">
                                {loadingMinhas ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : filteredManifestacoes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
                                        <FileText className="w-12 h-12 mb-3 opacity-40" />
                                        <p className="font-medium">Nenhuma manifestação encontrada</p>
                                        <p className="text-sm mt-1">Registre uma nova manifestação para começar</p>
                                    </div>
                                ) : (
                                    filteredManifestacoes.map((m) => (
                                        <ManifestacaoListItem
                                            key={m.id}
                                            protocolo={m.protocolo}
                                            tipo={m.tipo}
                                            status={m.status}
                                            createdAt={m.created_at}
                                            isSelected={selectedId === m.id}
                                            onClick={() => handleSelectManifestacao(m)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita - Detalhes */}
                    <div className="w-full lg:w-3/4">
                        <AnimatePresence mode="wait">
                            {result ? (
                                <motion.div
                                    key={result.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-bg-card rounded-2xl border border-border-color overflow-hidden h-full flex flex-col"
                                >
                                    {/* Header do Card */}
                                    <div className="bg-bg-secondary p-6 border-b border-border-color flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <span className="text-text-secondary font-bold uppercase text-xs tracking-wider block mb-1">Protocolo</span>
                                            <h3 className="text-2xl font-black text-text-primary tracking-tight">{result.protocolo}</h3>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl border ${getStatusColor(result.status)} flex items-center gap-2`}>
                                            <div className={`w-2 h-2 rounded-full ${result.status === "CONCLUIDO" ? "bg-green-500" : result.status === "EM_ANALISE" ? "bg-blue-500" : "bg-yellow-500"}`} />
                                            <span className="font-bold text-sm uppercase tracking-wide">{getStatusLabel(result.status)}</span>
                                        </div>
                                    </div>

                                    {/* Conteúdo do Card */}
                                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Abertura</span>
                                                    <p className="text-sm font-bold text-text-primary">
                                                        {new Date(result.data_criacao).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Atualização</span>
                                                    <p className="text-sm font-bold text-text-primary">
                                                        {new Date(result.ultima_atualizacao).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Departamento</span>
                                                    <p className="text-sm font-bold text-text-primary truncate">{result.secretaria}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                                                    <Megaphone className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Tipo</span>
                                                    <p className="text-sm font-bold text-text-primary">{TIPO_LABELS[result.tipo] || result.tipo}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Relato */}
                                        <div>
                                            <span className="text-text-secondary font-bold uppercase text-xs tracking-wider block mb-2">Relato</span>
                                            <div className="bg-bg-secondary p-4 rounded-xl border border-border-color">
                                                <p className="text-text-secondary italic text-sm leading-relaxed whitespace-pre-wrap">"{result.relato}"</p>
                                            </div>
                                        </div>

                                        {/* Chat */}
                                        <div>
                                            <ChatMensagens
                                                mensagens={mensagens}
                                                onEnviar={handleEnviarMensagem}
                                                tipoUsuario="CIDADAO"
                                                loading={loadingMensagens}
                                                readOnly={result.status === "ARQUIVADO" || result.status === "CONCLUIDO"}
                                            />
                                        </div>

                                        {/* Botão Finalizar */}
                                        {result.status !== "CONCLUIDO" && result.status !== "ARQUIVADO" && (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleFinalizar}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg font-bold text-sm transition-all"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Encerrar manifestação
                                                </button>
                                            </div>
                                        )}

                                        {/* Pesquisa de Satisfação */}
                                        {result.status === "CONCLUIDO" && result.resposta_oficial && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                {satisfacaoSalva ? (
                                                    <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/30 text-center">
                                                        <span className="text-green-600 dark:text-green-400 font-bold">
                                                            ✓ Obrigado pela sua avaliação!
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="bg-bg-secondary p-6 rounded-xl border border-border-color">
                                                        <h4 className="text-lg font-bold text-text-primary mb-4 text-center">
                                                            Como você avalia a resposta?
                                                        </h4>
                                                        <div className="flex justify-center">
                                                            <SentimentWidget
                                                                value={satisfacao}
                                                                onChange={handleSatisfacaoChange}
                                                            />
                                                        </div>
                                                        {salvandoSatisfacao && (
                                                            <p className="text-center text-text-secondary text-sm mt-3">
                                                                Salvando avaliação...
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-bg-card rounded-2xl border border-border-color h-full flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                        <Search className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary mb-2">
                                        Selecione uma manifestação
                                    </h3>
                                    <p className="text-text-secondary max-w-sm">
                                        Escolha uma manifestação da lista ao lado ou busque por um protocolo específico.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
