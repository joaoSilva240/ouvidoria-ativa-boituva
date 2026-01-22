"use client";

import { motion } from "framer-motion";

interface SentimentOptionProps {
    emoji: string;
    label: string;
    bgColor: string;
}

function SentimentOption({ emoji, label, bgColor }: SentimentOptionProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
        >
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-sm"
                style={{ backgroundColor: `${bgColor}20` }} // 20 é para opacidade ~12%
            >
                <span>{emoji}</span>
            </div>
            <span className="font-semibold text-grafite/70 text-lg uppercase tracking-wider">{label}</span>
        </motion.button>
    );
}

export function SentimentWidget() {
    const options = [
        { emoji: "😊", label: "Feliz", bgColor: "#10B981" }, // Verde Natureza
        { emoji: "😐", label: "Normal", bgColor: "#0EA5E9" }, // Azul Céu
        { emoji: "☹️", label: "Chateado", bgColor: "#F59E0B" }, // Amarelo Aventura
        { emoji: "😡", label: "Bravo", bgColor: "#DC2626" }, // Vermelho
    ];

    return (
        <div className="bg-white rounded-[40px] shadow-xl p-10 w-full max-w-2xl flex flex-col items-center gap-8 border border-slate-100">
            <h3 className="text-2xl font-bold text-grafite tracking-tight">
                Como você está se sentindo hoje?
            </h3>

            <div className="flex justify-between w-full px-4">
                {options.map((opt) => (
                    <SentimentOption key={opt.label} {...opt} />
                ))}
            </div>
        </div>
    );
}
