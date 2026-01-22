"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { Search, Loader2, ArrowRight, AlertCircle, Calendar, Megaphone, Building2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getManifestacaoByProtocol } from "@/app/actions/consulta";

export default function ConsultaPage() {
    const [protocolo, setProtocolo] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null); // TODO: Tipar
    const [error, setError] = useState("");

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

        if (response.success) {
            setResult(response.data);
        } else {
            setError(response.error || "Manifestação não encontrada.");
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
        <div className="min-h-screen bg-offwhite font-sans text-grafite flex flex-col">
            <WizardHeader />

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
                        className="text-5xl font-bold text-grafite mb-6 tracking-tight"
                    >
                        Acompanhe sua Manifestação
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-grafite/60 font-medium max-w-2xl mx-auto"
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
                        className="w-full h-24 rounded-[32px] border-4 border-slate-100 bg-white px-10 text-3xl font-bold text-grafite placeholder:text-slate-300 outline-none focus:border-primary transition-all shadow-xl shadow-slate-100"
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
                            className="w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            {/* Header do Card */}
                            <div className="bg-slate-50 p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <span className="text-slate-400 font-bold uppercase text-sm tracking-wider block mb-2">Protocolo</span>
                                    <h3 className="text-4xl font-black text-grafite tracking-tight">{result.protocolo}</h3>
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
                                            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Data de Abertura</span>
                                            <p className="text-lg font-bold text-grafite">
                                                {new Date(result.data_criacao).toLocaleDateString('pt-BR')}
                                                <span className="text-slate-400 font-normal ml-2">
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
                                            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Última Atualização</span>
                                            <p className="text-lg font-bold text-grafite">
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
                                            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Departamento</span>
                                            <p className="text-lg font-bold text-grafite leading-tight">{result.secretaria}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                                            <Megaphone className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Tipo</span>
                                            <p className="text-lg font-bold text-grafite capitalize">{result.tipo}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-8 border-t border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase text-xs tracking-wider block mb-4">Relato Registrado</span>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <p className="text-grafite/80 italic text-lg leading-relaxed whitespace-pre-wrap">"{result.relato}"</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}

// Icone Clock (Lucide pode não ter exportado no import grandão, adicionando aqui para garantir ou importar do lucide)
import { Clock } from "lucide-react";
