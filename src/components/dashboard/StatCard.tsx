"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: "primary" | "green" | "yellow" | "grafite";
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
    const colorVariants = {
        primary: "bg-primary",
        green: "bg-verde-natureza",
        yellow: "bg-amarelo-aventura",
        grafite: "bg-grafite",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[24px] shadow-lg p-6 flex items-center gap-6 min-h-[140px]"
        >
            {/* Icon Container */}
            <div className={`${colorVariants[color]} rounded-full p-4 flex items-center justify-center min-w-[64px] h-16`}>
                <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>

            {/* Content */}
            <div className="flex flex-col">
                <p className="text-grafite/60 text-sm font-medium uppercase tracking-wide mb-1">
                    {label}
                </p>
                <p className="text-4xl font-bold text-grafite">
                    {value}
                </p>
            </div>
        </motion.div>
    );
}
