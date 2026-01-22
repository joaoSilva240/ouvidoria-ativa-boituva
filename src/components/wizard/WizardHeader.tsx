"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function WizardHeader() {
    const router = useRouter();

    return (
        <header className="w-full flex justify-between items-center py-6 px-12 bg-white/50 backdrop-blur-sm border-b border-slate-100">
            <div className="flex flex-col items-start leading-tight">
                <h1 className="text-2xl font-bold text-grafite tracking-tighter">Boituva</h1>
                <p className="text-grafite/40 text-xs font-semibold tracking-widest uppercase">Ouvidoria Digital</p>
            </div>

            <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-slate-200 text-grafite font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            >
                <ChevronLeft className="w-5 h-5" />
                Voltar
            </button>
        </header>
    );
}
