"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CategoryCardProps {
    label: string;
    icon: LucideIcon;
    color: string;
    isActive: boolean;
    onClick: () => void;
}

export function CategoryCard({
    label,
    icon: Icon,
    color,
    isActive,
    onClick,
}: CategoryCardProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "bg-white rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 transition-all shadow-md border-4 h-56 w-full",
                isActive ? "border-primary" : "border-transparent"
            )}
        >
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                style={{ backgroundColor: `${color}15`, color: color }}
            >
                <Icon className="w-10 h-10" strokeWidth={2.5} />
            </div>

            <span className={cn(
                "text-2xl font-bold tracking-tight",
                isActive ? "text-grafite" : "text-grafite/80"
            )}>
                {label}
            </span>
        </motion.button>
    );
}
