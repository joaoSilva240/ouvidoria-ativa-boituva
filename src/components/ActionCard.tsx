"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";


interface ActionCardProps {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    variant?: "primary" | "grafite";
    onClick?: () => void;
}

export function ActionCard({
    title,
    subtitle,
    icon: Icon,
    variant = "primary",
    onClick,
}: ActionCardProps) {
    const variants = {
        primary: "bg-primary text-white",
        grafite: "bg-grafite text-white",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "relative w-full min-h-[130px] rounded-[32px] p-6 flex items-center justify-between overflow-hidden shadow-lg",
                variants[variant]
            )}
        >
            <div className="flex flex-col items-start text-left z-10">
                <h2 className="text-xl font-bold mb-1 leading-tight">{title}</h2>
                <p className="text-white/80 text-base">{subtitle}</p>
            </div>

            <div className="relative flex items-center justify-center w-14 h-14 z-10">
                {/* Pattern decorativo sutil */}
                <div className="absolute inset-0 bg-white/10 rounded-full scale-150 rotate-45 -z-10 translate-x-4" />

                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 shadow-inner">
                    <Icon className="w-7 h-7 text-white" strokeWidth={3} />
                </div>
            </div>

            {/* Detalhe geométrico no background */}
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/5 rounded-tl-[120px] -z-0 translate-x-12 translate-y-12" />
        </motion.button>
    );
}
