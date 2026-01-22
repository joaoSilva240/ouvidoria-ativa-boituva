"use client";

import { motion } from "framer-motion";

export type HumorType = "feliz" | "normal" | "chateado" | "bravo" | null;

interface SentimentOptionProps {
    emoji: string;
    label: string;
    bgColor: string;
    value: string;
    isSelected: boolean;
    onClick: () => void;
}

function SentimentOption({ emoji, label, bgColor, isSelected, onClick }: SentimentOptionProps) {
    return (
        <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`flex flex-col items-center gap-3 transition-all ${isSelected ? "opacity-100 scale-110" : "opacity-60 hover:opacity-80"
                }`}
        >
            <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all ${isSelected ? "shadow-lg ring-4 ring-offset-2" : "shadow-sm"
                    }`}
                style={{
                    backgroundColor: `${bgColor}${isSelected ? "40" : "20"}`
                }}
            >
                <span>{emoji}</span>
            </div>
            <span className={`font-semibold text-lg uppercase tracking-wider transition-colors ${isSelected ? "text-grafite" : "text-grafite/70"
                }`}>
                {label}
            </span>
        </motion.button>
    );
}

interface SentimentWidgetProps {
    value: HumorType;
    onChange: (humor: HumorType) => void;
}

export function SentimentWidget({ value, onChange }: SentimentWidgetProps) {
    const options = [
        { emoji: "😊", label: "Feliz", value: "feliz" as const, bgColor: "#10B981" },
        { emoji: "😐", label: "Normal", value: "normal" as const, bgColor: "#0EA5E9" },
        { emoji: "☹️", label: "Chateado", value: "chateado" as const, bgColor: "#F59E0B" },
        { emoji: "😡", label: "Bravo", value: "bravo" as const, bgColor: "#DC2626" },
    ];

    return (
        <div className="bg-white rounded-[40px] shadow-xl p-10 w-full max-w-3xl flex flex-col items-center gap-8 border border-slate-100">
            <h3 className="text-2xl font-bold text-grafite tracking-tight">
                Como você está se sentindo hoje?
            </h3>

            <div className="flex justify-between w-full px-4 gap-4">
                {options.map((opt) => (
                    <SentimentOption
                        key={opt.value}
                        {...opt}
                        isSelected={value === opt.value}
                        onClick={() => onChange(opt.value)}
                    />
                ))}
            </div>
        </div>
    );
}
