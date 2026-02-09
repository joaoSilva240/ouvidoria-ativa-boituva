"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Search, Loader2, ArrowRight, AlertCircle, Calendar, Megaphone, Building2, MapPin, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory } from "@/contexts/HistoryContext";
import { getManifestacaoByProtocol, saveSatisfacaoResposta } from "@/app/actions/consulta";
import { getMensagens, enviarMensagemCidadao, finalizarManifestacaoCidadao, TipoMensagem } from "@/app/actions/mensagens";
import { ChatMensagens } from "@/components/ChatMensagens";
import { SentimentWidget, HumorType } from "@/components/SentimentWidget";

const TIPO_LABELS: Record<string, string> = {
    "ELOGIO": "Elogio",
    "SUGESTAO": "Sugestão",
    "RECLAMACAO": "Reclamação",
    "DENUNCIA": "Denúncia",
    "INFORMACAO": "Informação",
    "OUTROS": "Outros",
};

export default function ConsultaPage() {
    const [protocolo, setProtocolo] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null); // TODO: Tipar
    const [error, setError] = useState("");
    const [satisfacao, setSatisfacao] = useState<HumorType>(null);
    const [satisfacaoSalva, setSatisfacaoSalva] = useState(false);
    const [salvandoSatisfacao, setSalvandoSatisfacao] = useState(false);

    // Chat state
    const [mensagens, setMensagens] = useState<any[]>([]);
    const [loadingMensagens, setLoadingMensagens] = useState(false);

    // Hooks
    const router = useRouter();
    const { addToHistory } = useHistory();

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

            // Adicionar ao histórico
            if (response.data.protocolo && response.data.tipo) {
                addToHistory(response.data.protocolo, response.data.tipo);
            }

            // Se já tem satisfação salva, marcar como salva
            if (response.data.satisfacao_resposta) {
                setSatisfacao(response.data.satisfacao_resposta as HumorType);
                setSatisfacaoSalva(true);
                setSatisfacao(null);
                setSatisfacaoSalva(false);
            }

            // Carregar mensagens do chat (apenas públicas)
            setLoadingMensagens(true);
            try {
                const msgs = await getMensagens(response.data.id, 'CIDADAO');
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

        // Cidadão só envia tipo CIDADAO
        await enviarMensagemCidadao(result.protocolo, conteudo);

        // Recarregar mensagens
        const msgs = await getMensagens(result.id, 'CIDADAO');
        setMensagens(msgs);
    };

    const handleFinalizar = async () => {
        if (!result) return;
        if (!confirm("Deseja encerrar esta manifestação? Isso confirmará que seu problema foi resolvido ou esclarecido.")) return;

        try {
            await finalizarManifestacaoCidadao(result.protocolo);

            // Recarregar dados para atualizar status na tela
            // Simula re-submit do form
            const button = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
            if (button) button.click();

            alert("Manifestação finalizada com sucesso. Obrigado!");
        } catch (error) {
            console.error(error);
            alert("Não foi possível finalizar a manifestação.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDENTE': return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case 'EM_ANALISE': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'CONCLUIDO': return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDENTE': return "Pendente";
            case 'EM_ANALISE': return "Em Análise";
            case 'CONCLUIDO': return "Concluído";
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary font-sans text-text-primary flex flex-col transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex flex-col items-center pt-20 px-8 pb-32 max-w-4xl mx-auto w-full">

                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/5 rounded-full text-primary font-bold text-sm tracking-widest uppercase"
                    >
                        <Search className="w-4 h-4" />
                        Consulta Pública
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-bold text-text-primary mb-6 tracking-tight"
                    >
                        Acompanhe sua Manifestação
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-text-secondary font-medium max-w-2xl mx-auto"
                    >
                        Digite o número do protocolo recibido para verificar o andamento da sua solicitação.
                    </motion.p>
                </div>

                <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSearch}
                    className="w-full max-w-2xl relative mb-16"
                >
                    <input
                        type="text"
                        value={protocolo}
                        onChange={(e) => setProtocolo(e.target.value.toUpperCase())}
                        placeholder="Ex: OUV-2024-1234"
                        className="w-full h-24 rounded-[32px] border-4 border-border-color bg-bg-card px-10 text-3xl font-bold text-text-primary placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:border-primary transition-all shadow-xl shadow-slate-100 dark:shadow-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-4 top-4 h-16 w-16 bg-primary rounded-[24px] flex items-center justify-center text-white hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:grayscale"
                    >
                        {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ArrowRight className="w-8 h-8" />}
                    </button>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-12 left-0 w-full text-center flex items-center justify-center gap-2 text-red-500 font-bold"
                        >
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </motion.div>
                    )}
                </motion.form>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="w-full bg-bg-card rounded-[40px] shadow-2xl border border-border-color overflow-hidden"
                        >
                            {/* Header do Card */}
                            <div className="bg-bg-secondary p-10 border-b border-border-color flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <span className="text-text-secondary font-bold uppercase text-sm tracking-wider block mb-2">Protocolo</span>
                                    <h3 className="text-4xl font-black text-text-primary tracking-tight">{result.protocolo}</h3>
                                </div>
                                <div className={`px-6 py-3 rounded-2xl border ${getStatusColor(result.status)} flex items-center gap-3`}>
                                    <div className={`w-3 h-3 rounded-full ${result.status === 'CONCLUIDO' ? 'bg-green-500' : result.status === 'EM_ANALISE' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                                    <span className="font-bold text-lg uppercase tracking-wide">{getStatusLabel(result.status)}</span>
                                </div>
                            </div>

                            {/* Conteúdo do Card */}
                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Data de Abertura</span>
                                            <p className="text-lg font-bold text-text-primary">
                                                {new Date(result.data_criacao).toLocaleDateString('pt-BR')}
                                                <span className="text-text-secondary font-normal ml-2">
                                                    às {new Date(result.data_criacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Última Atualização</span>
                                            <p className="text-lg font-bold text-text-primary">
                                                {new Date(result.ultima_atualizacao).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Departamento</span>
                                            <p className="text-lg font-bold text-text-primary leading-tight">{result.secretaria}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <Megaphone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-text-secondary font-bold uppercase text-xs tracking-wider">Tipo</span>
                                            <p className="text-lg font-bold text-text-primary">{TIPO_LABELS[result.tipo] || result.tipo}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-8 border-t border-border-color">
                                    <span className="text-text-secondary font-bold uppercase text-xs tracking-wider block mb-4">Relato Registrado</span>
                                    <div className="bg-bg-secondary p-6 rounded-2xl border border-border-color mb-8">
                                        <p className="text-text-secondary italic text-lg leading-relaxed whitespace-pre-wrap">"{result.relato}"</p>
                                    </div>

                                    {/* Chat Integration substituindo exibição estática antiga */}
                                    <div className="mt-8">
                                        <ChatMensagens
                                            mensagens={mensagens}
                                            onEnviar={handleEnviarMensagem}
                                            tipoUsuario="CIDADAO"
                                            loading={loadingMensagens}
                                            readOnly={result.status === 'ARQUIVADO' || result.status === 'CONCLUIDO'}
                                        />
                                    </div>

                                    {/* Botão de Finalizar pelo Cidadão */}
                                    {result.status !== 'CONCLUIDO' && result.status !== 'ARQUIVADO' && (
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={handleFinalizar}
                                                className="flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-xl font-bold transition-all shadow-sm"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Meu problema foi resolvido, encerrar manifestação
                                            </button>
                                        </div>
                                    )}

                                    {/* Pesquisa de Satisfação - Apenas se concluído e tem resposta */}
                                    {result.status === 'CONCLUIDO' && result.resposta_oficial && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="md:col-span-2 mt-8"
                                        >
                                            {satisfacaoSalva ? (
                                                <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-3xl border-2 border-green-100 dark:border-green-900/30 text-center">
                                                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                                                        ✓ Obrigado pela sua avaliação!
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="bg-bg-secondary p-8 rounded-3xl border border-border-color">
                                                    <h4 className="text-xl font-bold text-text-primary mb-6 text-center">
                                                        Como você avalia a resposta recebida?
                                                    </h4>
                                                    <div className="flex justify-center">
                                                        <SentimentWidget
                                                            value={satisfacao}
                                                            onChange={handleSatisfacaoChange}
                                                        />
                                                    </div>
                                                    {salvandoSatisfacao && (
                                                        <p className="text-center text-text-secondary mt-4">
                                                            Salvando avaliação...
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}

// Icone Clock e outros components
import { Clock } from "lucide-react";
