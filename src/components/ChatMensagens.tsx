"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Lock, User, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";
import { Mensagem, TipoMensagem } from "@/app/actions/mensagens";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMensagensProps {
    mensagens: Mensagem[];
    onEnviar: (conteudo: string, tipo: TipoMensagem) => Promise<void>;
    tipoUsuario: 'OUVIDOR' | 'CIDADAO';
    loading?: boolean;
    readOnly?: boolean;
}

export function ChatMensagens({
    mensagens,
    onEnviar,
    tipoUsuario,
    loading = false,
    readOnly = false
}: ChatMensagensProps) {
    const [novoConteudo, setNovoConteudo] = useState("");
    const [tipoEnvio, setTipoEnvio] = useState<TipoMensagem>(
        tipoUsuario === 'OUVIDOR' ? 'RESPOSTA_OFICIAL' : 'CIDADAO'
    );
    const [enviando, setEnviando] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para baixo quando novas mensagens chegam
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensagens]);

    const handleEnviar = async () => {
        if (!novoConteudo.trim()) return;

        setEnviando(true);
        try {
            await onEnviar(novoConteudo, tipoEnvio);
            setNovoConteudo("");
        } catch (error) {
            alert("Erro ao enviar mensagem");
        } finally {
            setEnviando(false);
        }
    };

    // Formatar data
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-grafite text-sm uppercase tracking-wide">
                    Histórico de Comunicação
                </h3>
            </div>

            {/* Lista de Mensagens */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Carregando histórico...</span>
                    </div>
                ) : mensagens.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
                        <MessageSquare className="w-12 h-12" />
                        <p>Nenhuma mensagem registrada ainda.</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {mensagens.map((msg) => {
                            const isCidadao = msg.tipo === 'CIDADAO';
                            const isNotaInterna = msg.tipo === 'NOTA_INTERNA';
                            const isMinhaMensagem =
                                (tipoUsuario === 'CIDADAO' && isCidadao) ||
                                (tipoUsuario === 'OUVIDOR' && !isCidadao);

                            // Define estilos baseados no tipo
                            let bgClass = "bg-white border-slate-200";
                            let icon = null;
                            let badge = null;

                            if (msg.tipo === 'RESPOSTA_OFICIAL') {
                                bgClass = "bg-blue-50 border-blue-100 text-grafite";
                                icon = <CheckCircle2 className="w-4 h-4 text-blue-500" />;
                                badge = <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">Resposta Oficial</span>;
                            } else if (msg.tipo === 'NOTA_INTERNA') {
                                bgClass = "bg-amber-50 border-amber-100 text-grafite";
                                icon = <Lock className="w-4 h-4 text-amber-500" />;
                                badge = <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1">🔒 Nota Interna</span>;
                            } else { // CIDADAO
                                bgClass = "bg-slate-100 border-slate-200 text-grafite";
                                icon = <User className="w-4 h-4 text-slate-500" />;
                                badge = <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">Cidadão</span>;
                            }

                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col ${isCidadao ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex items-center gap-2 mb-1 px-1 ${isCidadao ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-xs font-bold text-slate-500">{msg.autor_nome || (isCidadao ? "Cidadão" : "Ouvidoria")}</span>
                                        <span className="text-[10px] text-slate-400">{formatDate(msg.created_at)} às {formatTime(msg.created_at)}</span>
                                    </div>

                                    <div className={`
                                        relative max-w-[85%] rounded-2xl p-4 border shadow-sm
                                        ${bgClass}
                                        ${isCidadao ? 'rounded-tr-none' : 'rounded-tl-none'}
                                    `}>
                                        <div className="flex items-center justify-between gap-3 mb-2 border-b border-black/5 pb-2">
                                            <div className="flex items-center gap-2">
                                                {icon}
                                                {badge}
                                            </div>
                                        </div>
                                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                                            {msg.conteudo}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            {/* Input Area */}
            {!readOnly && (
                <div className="p-4 bg-white border-t border-slate-100">

                    {/* Controles para Ouvidor */}
                    {tipoUsuario === 'OUVIDOR' && (
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => setTipoEnvio('RESPOSTA_OFICIAL')}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5
                                    ${tipoEnvio === 'RESPOSTA_OFICIAL'
                                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20'
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
                                `}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Resposta Oficial
                            </button>
                            <button
                                onClick={() => setTipoEnvio('NOTA_INTERNA')}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5
                                    ${tipoEnvio === 'NOTA_INTERNA'
                                        ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500/20'
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}
                                `}
                            >
                                <Lock className="w-3.5 h-3.5" />
                                Nota Interna
                            </button>
                        </div>
                    )}

                    <div className="relative">
                        <textarea
                            value={novoConteudo}
                            onChange={(e) => setNovoConteudo(e.target.value)}
                            placeholder={
                                tipoUsuario === 'OUVIDOR'
                                    ? (tipoEnvio === 'RESPOSTA_OFICIAL' ? "Escreva a resposta para o cidadão..." : "Escreva uma nota interna...")
                                    : "Escreva sua mensagem..."
                            }
                            className={`
                                w-full h-24 rounded-xl p-4 pr-14 text-sm resize-none focus:outline-none focus:ring-2 transition-all
                                ${tipoEnvio === 'NOTA_INTERNA'
                                    ? 'bg-amber-50 border border-amber-200 focus:ring-amber-200 focus:border-amber-300 placeholder:text-amber-400'
                                    : 'bg-slate-50 border border-slate-200 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400'}
                            `}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleEnviar();
                                }
                            }}
                        />

                        <button
                            onClick={handleEnviar}
                            disabled={!novoConteudo.trim() || enviando}
                            className={`
                                absolute right-3 bottom-3 p-2 rounded-lg text-white shadow-sm transition-all
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${tipoEnvio === 'NOTA_INTERNA'
                                    ? 'bg-amber-500 hover:bg-amber-600'
                                    : 'bg-primary hover:bg-primary/90'}
                            `}
                        >
                            {enviando ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-right">
                        Pressione Enter para enviar
                    </p>
                </div>
            )}
        </div>
    );
}
