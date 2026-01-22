"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LucideIcon, ChevronDown } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    icon?: LucideIcon;
    options: string[];
    placeholder?: string;
}

export function FormSelect({ label, icon: Icon, options, placeholder, className, ...props }: FormSelectProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-bold text-grafite">{label}</label>
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-6 text-slate-400 z-10 pointer-events-none">
                        <Icon className="w-6 h-6" />
                    </div>
                )}
                <select
                    {...props}
                    className={cn(
                        "w-full h-20 rounded-2xl border-2 border-slate-100 bg-white px-6 py-4 text-xl text-grafite transition-all outline-none focus:border-primary appearance-none",
                        Icon && "pl-16",
                        "pr-12", // Space for chevron
                        props.value === "" && "text-slate-400", // Placeholder color logic
                        className
                    )}
                >
                    <option value="" disabled selected hidden>
                        {placeholder || "Selecione uma opção"}
                    </option>
                    {options.map((option) => (
                        <option key={option} value={option} className="text-grafite">
                            {option}
                        </option>
                    ))}
                </select>
                <div className="absolute right-6 text-slate-400 pointer-events-none">
                    <ChevronDown className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
