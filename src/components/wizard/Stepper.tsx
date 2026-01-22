"use client";

import { Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const steps = [
    { id: 1, label: "Identificação" },
    { id: 2, label: "Categoria" },
    { id: 3, label: "Relato" },
    { id: 4, label: "Finalizar" },
];

export function Stepper({ currentStep }: { currentStep: number }) {
    return (
        <div className="w-full max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between relative">
                {/* Linha de fundo */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />

                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 shadow-sm",
                                    isActive ? "bg-primary text-white scale-110 shadow-primary/20" :
                                        isCompleted ? "bg-verde-natureza text-white" : "bg-slate-100 text-slate-300"
                                )}
                            >
                                {isCompleted ? <Check className="w-6 h-6" /> : step.id}
                            </div>

                            <div className="absolute top-14 whitespace-nowrap">
                                <span className={cn(
                                    "text-sm font-bold transition-colors",
                                    isActive ? "text-primary border-b-4 border-primary pb-1" :
                                        isCompleted ? "text-verde-natureza" : "text-slate-300"
                                )}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="h-10" /> {/* Espaçador para as labels absolutas */}
        </div>
    );
}
