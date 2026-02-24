"use client";

import { useState } from "react";
import { ThumbsUp, Lightbulb, Megaphone, Gavel, Info, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Stepper } from "@/components/wizard/Stepper";
import { CategoryCard } from "@/components/wizard/CategoryCard";
import { useRouter } from "next/navigation";
import { useManifestacao } from "@/contexts/ManifestacaoContext";

const categories = [
    { id: "elogio", label: "Elogio", icon: ThumbsUp, color: "#10B981" }, // Verde Natureza
    { id: "sugestao", label: "Sugestão", icon: Lightbulb, color: "#F59E0B" }, // Amarelo Aventura
    { id: "reclamacao", label: "Reclamação", icon: Megaphone, color: "#F97316" }, // Laranja
    { id: "denuncia", label: "Denúncia", icon: Gavel, color: "#334155" }, // Grafite
    { id: "informacao", label: "Solicitação", icon: Info, color: "#0EA5E9" }, // Azul Céu
];

export default function CategoriaPage() {
    const { data, setCategoria } = useManifestacao();
    const [selected, setSelected] = useState<string | null>(data.categoria);
    const router = useRouter();

    const handleContinue = () => {
        if (selected) {
            setCategoria(selected);
            router.push("/registro/relato");
        }
    };

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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8 w-full mb-16 px-4 md:px-0">
                {/* Primeira Linha: 3 Colunas (cada uma ocupa 2 de 6) */}
                {categories.slice(0, 3).map((cat) => (
                    <div key={cat.id} className="md:col-span-2">
                        <CategoryCard
                            label={cat.label}
                            icon={cat.icon}
                            color={cat.color}
                            isActive={selected === cat.id}
                            onClick={() => setSelected(cat.id)}
                        />
                    </div>
                ))}

                {/* Segunda Linha: 2 Colunas Centralizadas */}
                {/* Espaçador para pular a primeira coluna de 6 */}
                <div className="hidden md:block md:col-span-1" />

                {categories.slice(3).map((cat) => (
                    <div key={cat.id} className="md:col-span-2">
                        <CategoryCard
                            label={cat.label}
                            icon={cat.icon}
                            color={cat.color}
                            isActive={selected === cat.id}
                            onClick={() => setSelected(cat.id)}
                        />
                    </div>
                ))}

                {/* Espaçador para completar o grid (opcional, mas bom para clareza) */}
                <div className="hidden md:block md:col-span-1" />
            </div>

            <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={!selected}
                onClick={handleContinue}
                className="w-full h-24 bg-primary text-white rounded-[24px] text-3xl font-bold flex items-center justify-center gap-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all"
            >
                CONTINUAR
                <ArrowRight className="w-10 h-10" />
            </motion.button>
        </div>
    );
}
