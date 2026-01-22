"use client";

import { useState } from "react";
import { ArrowRight, X, Info, Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Stepper } from "@/components/wizard/Stepper";
import { FormSelect } from "@/components/wizard/FormSelect";
import { FormInput } from "@/components/wizard/FormInput";
import { useRouter } from "next/navigation";
import { useManifestacao } from "@/contexts/ManifestacaoContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const secretariats = [
    "Administração e Equipamentos Públicos",
    "Assistência Social, Cidadania e Inclusão",
    "Assuntos Jurídicos",
    "Chefia de Gabinete",
    "Comunicação",
    "Cultura e Economia Criativa",
    "Educação",
    "Esportes",
    "Fazenda, Desenvolvimento Econômico e Finanças",
    "Governo e Planejamento Estratégico",
    "Meio Ambiente, Parques e Bem-Estar Animal",
    "Obras Públicas",
    "Planejamento Urbano e Habitação",
    "Saúde",
    "Segurança Pública",
    "Serviços",
    "Trânsito e Mobilidade Urbana",
    "Turismo, Juventude e Empreendedorismo"
];

export default function RelatoPage() {
    const { data, setRelato, setSecretaria, setEndereco } = useManifestacao();
    const [text, setText] = useState(data.relato);
    const [secretaria, setSecretariaState] = useState(data.secretaria);
    const [endereco, setEnderecoState] = useState(data.endereco);
    const router = useRouter();

    const handleContinue = () => {
        setRelato(text);
        setSecretaria(secretaria);
        setEndereco(endereco);
        router.push("/registro/finalizar");
    };

    return (
        <div className="flex flex-col items-center max-w-6xl mx-auto pb-32">
            <Stepper currentStep={3} />

            <header className="text-center mb-10">
                <h2 className="text-5xl font-bold text-grafite mb-4 tracking-tight">
                    Detalhes da Manifestação
                </h2>
                <p className="text-2xl text-grafite/60 font-medium max-w-3xl mx-auto leading-relaxed">
                    Precisamos de algumas informações para encaminhar sua solicitação ao setor correto.
                </p>
            </header>

            <div className="w-full flex flex-col gap-8 mb-8">
                <FormSelect
                    label="Secretaria / Departamento"
                    placeholder="Selecione o departamento responsável"
                    icon={Building2}
                    options={secretariats}
                    value={secretaria}
                    onChange={(e) => setSecretariaState(e.target.value)}
                />

                <FormInput
                    label="Endereço da Ocorrência"
                    placeholder="Rua, número, bairro..."
                    icon={MapPin}
                    value={endereco}
                    onChange={(e) => setEnderecoState(e.target.value)}
                />
            </div>

            <div className="w-full mb-4">
                <label className="text-xl font-bold text-grafite mb-2 block">Descrição do Ocorrido</label>
            </div>

            {/* Área de Texto / Card Principal */}
            <div className="relative w-full">
                <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 min-h-[500px] flex flex-col p-8 transition-all focus-within:ring-4 focus-within:ring-primary/10">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 w-full text-2xl text-grafite placeholder-transparent outline-none resize-none bg-transparent pt-4"
                        placeholder="Diga-nos o que aconteceu..."
                    />

                    {/* Mockup de Hint Visual quando vazio */}
                    {!text && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                    {/* Ícone de toque/mão simulado */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                                        <path d="M12 11c0-1.1.9-2 2-2s2 .9 2 2v2c0 1.1-.9 2-2 2s-2-.9-2-2v-2z" />
                                        <path d="M16 11c0-1.1.9-2 2-2s2 .9 2 2v2c0 1.1-.9 2-2 2s-2-.9-2-2v-2z" />
                                        <path d="M8 11c0-1.1.9-2 2-2s2 .9 2 2v2c0 1.1-.9 2-2 2s-2-.9-2-2v-2z" />
                                        <path d="M20 13c0-1.1.9-2 2-2s2 .9 2 2v2c0 1.1-.9 2-2 2s-2-.9-2-2v-2z" />
                                        <path d="M4 13c0-1.1.9-2 2-2s2 .9 2 2v2a8 8 0 0 0 16 0V11a2 2 0 0 0-2-2M12 3v3" />
                                    </svg>
                                </div>
                                <span className="text-3xl font-bold text-primary tracking-tight">Toque aqui para digitar</span>
                            </div>
                        </div>
                    )}

                    {/* Botão de Limpar (Simulado como no mockup) */}
                    {text && (
                        <button
                            onClick={() => setText("")}
                            className="absolute right-8 bottom-8 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Info Teclado */}
            <div className="mt-8 bg-primary/5 px-8 py-4 rounded-full flex items-center gap-3 border border-primary/10">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">i</div>
                <p className="text-primary font-bold text-lg">O teclado virtual aparecerá ao tocar na área de texto.</p>
            </div>

            {/* Botão Continuar Flutuante / Inferior */}
            <div className="fixed bottom-0 left-0 w-full p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 z-50 flex justify-center">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={!text || !secretaria || !endereco}
                    onClick={handleContinue}
                    className="w-full max-w-6xl h-24 bg-primary text-white rounded-[24px] text-3xl font-bold flex items-center justify-center gap-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
                >
                    CONTINUAR
                    <ArrowRight className="w-10 h-10" />
                </motion.button>
            </div>

        </div>
    );
}