"use client";

import { useState } from "react";
import { ThumbsUp, Lightbulb, Megaphone, Gavel, Info, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Stepper } from "@/components/wizard/Stepper";
import { CategoryCard } from "@/components/wizard/CategoryCard";
import { useRouter } from "next/navigation";

const categories = [
    { id: "elogio", label: "Elogio", icon: ThumbsUp, color: "#10B981" }, // Verde Natureza
    { id: "sugestao", label: "Sugestão", icon: Lightbulb, color: "#F59E0B" }, // Amarelo Aventura
    { id: "reclamacao", label: "Reclamação", icon: Megaphone, color: "#F97316" }, // Laranja
    { id: "denuncia", label: "Denúncia", icon: Gavel, color: "#334155" }, // Grafite
    { id: "informacao", label: "Informação", icon: Info, color: "#0EA5E9" }, // Azul Céu
];

export default function CategoriaPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();

    return (
        <div className="flex flex-col items-center max-w-6xl mx-auto pb-20">
            <Stepper currentStep={2} />

            <header className="text-center mb-12">
                <h2 className="text-5xl font-bold text-grafite mb-4 tracking-tight">
                    O que você deseja registrar?
                </h2>
                <p className="text-2xl text-grafite/50 font-medium">
                    Toque em uma das opções abaixo para continuar.
                </p>
            </header>

            {/* Grid de Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-16">
                {categories.slice(0, 3).map((cat) => (
                    <CategoryCard
                        key={cat.id}
                        label={cat.label}
                        icon={cat.icon}
                        color={cat.color}
                        isActive={selected === cat.id}
                        onClick={() => setSelected(cat.id)}
                    />
                ))}
                <div className="md:col-span-3 flex justify-center gap-8">
                    {categories.slice(3).map((cat) => (
                        <div key={cat.id} className="w-full md:w-1/3">
                            <CategoryCard
                                label={cat.label}
                                icon={cat.icon}
                                color={cat.color}
                                isActive={selected === cat.id}
                                onClick={() => setSelected(cat.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={!selected}
                onClick={() => router.push("/registro/relato")}
                className="w-full h-24 bg-primary text-white rounded-[24px] text-3xl font-bold flex items-center justify-center gap-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
            >
                CONTINUAR
                <ArrowRight className="w-10 h-10" />
            </motion.button>
        </div>
    );
}
