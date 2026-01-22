"use client";

import { useState } from "react";
import { User, EyeOff, Mail, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/wizard/Stepper";
import { FormInput } from "@/components/wizard/FormInput";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function IdentificacaoPage() {
    const [mode, setMode] = useState<"identificado" | "anonimo">("identificado");

    return (
        <div className="flex flex-col items-center max-w-5xl mx-auto">
            <Stepper currentStep={1} />

            <header className="text-center mb-12">
                <h2 className="text-4xl font-bold text-grafite mb-2">Como deseja se identificar?</h2>
                <p className="text-xl text-grafite/50">Selecione uma das opções abaixo para continuar</p>
            </header>

            {/* Seleção de Modo */}
            <div className="grid grid-cols-2 gap-8 w-full mb-10">
                <button
                    onClick={() => setMode("identificado")}
                    className={cn(
                        "relative bg-white p-8 h-48 rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all shadow-md group border-4",
                        mode === "identificado" ? "border-primary" : "border-transparent"
                    )}
                >
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                        mode === "identificado" ? "bg-primary/10 text-primary" : "bg-slate-50 text-slate-300"
                    )}>
                        <User className="w-8 h-8" />
                    </div>
                    <span className={cn(
                        "text-2xl font-bold tracking-tight transition-colors",
                        mode === "identificado" ? "text-grafite" : "text-slate-300"
                    )}>
                        Identificado
                    </span>
                </button>

                <button
                    onClick={() => setMode("anonimo")}
                    className={cn(
                        "relative bg-white p-8 h-48 rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all shadow-md group border-4",
                        mode === "anonimo" ? "border-primary" : "border-transparent"
                    )}
                >
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                        mode === "anonimo" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-300"
                    )}>
                        <EyeOff className="w-8 h-8" />
                    </div>
                    <span className={cn(
                        "text-2xl font-bold tracking-tight transition-colors",
                        mode === "anonimo" ? "text-grafite" : "text-slate-300"
                    )}>
                        Anônimo
                    </span>
                </button>
            </div>

            {/* Formulário */}
            <motion.div
                layout
                className="bg-white rounded-[40px] shadow-xl p-12 w-full flex flex-col gap-8 border border-slate-100"
            >
                <AnimatePresence mode="wait">
                    {mode === "identificado" ? (
                        <motion.div
                            key="identificado"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col gap-8"
                        >
                            <FormInput
                                label="Nome Completo"
                                placeholder="Toque para digitar seu nome"
                                icon={User}
                            />
                            <FormInput
                                label="E-mail ou Telefone"
                                placeholder="exemplo@email.com ou (15) 99999-9999"
                                icon={Mail}
                                className="bg-slate-50/50"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="anonimo"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-10 text-center"
                        >
                            <p className="text-2xl text-grafite/60 font-medium italic">
                                Sua identidade será preservada. Você poderá acompanhar a manifestação pelo protocolo gerado ao final.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-20 bg-primary text-white rounded-[24px] text-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 mt-4 transition-transform hover:brightness-105"
                >
                    Continuar
                    <ArrowRight className="w-8 h-8" />
                </motion.button>
            </motion.div>
        </div>
    );
}
