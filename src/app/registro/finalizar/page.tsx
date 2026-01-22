"use client";

import { useState } from "react";
import { User, Megaphone, Building2, MapPin, Send, Laptop, Phone, Mail, Globe } from "lucide-react";
import { useManifestacao } from "@/contexts/ManifestacaoContext";
import { saveManifestacao } from "@/app/actions/manifestacao";
import { motion } from "framer-motion";
import { Stepper } from "@/components/wizard/Stepper";
import { SentimentWidget } from "@/components/SentimentWidget";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import Image from "next/image";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function FinalizarPage() {
    const { data, setHumor } = useManifestacao();
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSend = async () => {
        if (!agreed) return;
        setLoading(true);

        const result = await saveManifestacao(data);

        setLoading(false);

        if (result.success) {
            alert(`Manifestação enviada com sucesso! Protocolo: ${result.protocolo}`);
            // Redirecionar para página de sucesso ou limpar (em breve criar tela de sucesso)
            // router.push(/sucesso?protocolo=${result.protocolo})
        } else {
            alert(`Erro: ${result.error}`);
        }
    };

    const getCategoryDetails = (id: string | null) => {
        const categories = {
            elogio: { label: "Elogio", color: "text-verde-natureza bg-verde-natureza/5" },
            sugestao: { label: "Sugestão", color: "text-amarelo-aventura bg-amarelo-aventura/5" },
            reclamacao: { label: "Reclamação", color: "text-orange-500 bg-orange-500/5" },
            denuncia: { label: "Denúncia", color: "text-slate-700 bg-slate-700/5" },
            informacao: { label: "Informação", color: "text-sky-500 bg-sky-500/5" },
        };
        return categories[id as keyof typeof categories] || { label: "Não selecionado", color: "text-primary bg-primary/10" };
    };

    const categoryDetails = getCategoryDetails(data.categoria);

    return (
        <div className="flex flex-col items-center max-w-6xl mx-auto pb-20">
            <Stepper currentStep={4} />

            <header className="text-center mb-12">
                <h2 className="text-5xl font-bold text-grafite mb-4 tracking-tight">
                    Resumo e Finalização
                </h2>
                <p className="text-2xl text-grafite/60 font-medium">
                    Confira os dados abaixo antes de confirmar o envio da sua manifestação.
                </p>
            </header>

            {/* Card de Resumo */}
            <div className="bg-white rounded-[40px] shadow-2xl w-full overflow-hidden border border-slate-100 mb-12">
                <div className="p-10 border-b border-slate-50 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Laptop className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold text-grafite">Resumo da Manifestação</h3>
                </div>

                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 mb-12">
                        {/* Identificação */}
                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center text-primary shrink-0">
                                <User className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">Identificação</span>
                                <span className="text-2xl font-bold text-grafite">
                                    {data.identificacao.mode === 'anonimo' ? "Anônimo" : data.identificacao.nome || "Nome não informado"}
                                </span>
                                {data.identificacao.mode === 'identificado' && (
                                    <span className="text-slate-400 font-medium">{data.identificacao.contato || "Contato não informado"}</span>
                                )}
                            </div>
                        </div>

                        {/* Tipo */}
                        <div className="flex gap-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${categoryDetails.color}`}>
                                <Megaphone className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">Tipo de Manifestação</span>
                                <span className="px-4 py-1 bg-primary/10 text-primary font-bold rounded-lg text-lg">
                                    {categoryDetails.label}
                                </span>
                            </div>
                        </div>

                        {/* Departamento */}
                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-verde-natureza/5 rounded-full flex items-center justify-center text-verde-natureza shrink-0">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">Departamento/Secretaria</span>
                                <span className="text-xl font-bold text-grafite text-balance">{data.secretaria || "Não informado"}</span>
                            </div>
                        </div>

                        {/* Local */}
                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-marrom-cidade/5 rounded-full flex items-center justify-center text-marrom-cidade shrink-0">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-bold uppercase text-sm tracking-wider">Local do Ocorrido</span>
                                <span className="text-xl font-bold text-grafite text-balance">{data.endereco || "Não informado"}</span>
                                <span className="text-slate-400 font-medium tracking-tight">Boituva/SP</span>
                            </div>
                        </div>
                    </div>

                    {/* Descrição em destaque */}
                    <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100">
                        <span className="text-slate-400 font-bold uppercase text-sm tracking-wider block mb-4">Descrição do Ocorrido</span>
                        <p className="text-xl text-grafite/80 leading-relaxed italic break-words whitespace-pre-wrap">
                            "{data.relato || "Nenhuma descrição fornecida."}"
                        </p>
                    </div>
                </div>

            </div>

            {/* Ações Finais */}
            <div className="w-full flex flex-col items-center gap-12 mb-20">

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!agreed || loading}
                    className="w-full max-w-3xl h-28 bg-primary text-white rounded-[32px] text-4xl font-bold flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 transition-all hover:brightness-105 disabled:opacity-50 disabled:grayscale"
                >
                    {loading ? "ENVIANDO..." : "ENVIAR MANIFESTAÇÃO"}
                    {!loading && <Send className="w-10 h-10" />}
                </motion.button>

                <label className="flex items-start gap-6 max-w-3xl bg-primary/5 p-8 rounded-[32px] border border-primary/10 cursor-pointer transition-colors hover:bg-primary/10">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="w-10 h-10 rounded-xl border-4 border-slate-200 text-primary focus:ring-primary mt-1"
                    />
                    <p className="text-xl text-grafite/70 font-medium leading-relaxed">
                        Declaro que as informações fornecidas são verdadeiras e estou ciente de que a comunicação falsa de crimes ou contravenções constitui crime previsto no Código Penal Brasileiro.
                    </p>
                </label>
            </div>

            {/* Sentiment Widget */}
            <div className="w-full flex justify-center mb-12">
                <SentimentWidget value={data.humor} onChange={setHumor} />
            </div>

            {/* Rodapé Institucional */}
            <footer className="w-full bg-white rounded-[40px] shadow-sm p-16 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-16">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo-boituva.png"
                            alt="Boituva - Construindo progresso de mãos dadas"
                            width={180}
                            height={54}
                            className="h-14 w-auto"
                        />
                    </div>
                    <p className="text-slate-400 text-lg font-medium leading-tight">
                        Construindo progresso de mãos dadas.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <h4 className="text-xl font-bold text-grafite uppercase tracking-widest">Contato</h4>
                    <ul className="flex flex-col gap-4 text-slate-500 font-medium text-lg">
                        <li className="flex items-center gap-3">
                            <Phone className="w-6 h-6 text-primary" />
                            (15) 3263-8800
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-6 h-6 text-primary" />
                            ouvidoria@boituva.sp.gov.br
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-primary" />
                            Av. Tancredo Neves, 01 - Centro<br />Boituva - SP
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col gap-6">
                    <h4 className="text-xl font-bold text-grafite uppercase tracking-widest">Links Rápidos</h4>
                    <ul className="flex flex-col gap-4 text-slate-500 font-medium text-lg">
                        <li className="hover:text-primary cursor-pointer transition-colors">Portal da Transparência</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Diário Oficial</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Serviços Online</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Perguntas Frequentes</li>
                    </ul>
                </div>

                <div className="md:col-span-3 border-t border-slate-50 pt-10 text-center">
                    <p className="text-slate-300 font-medium text-lg">
                        © 2026 Prefeitura Municipal de Boituva. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
