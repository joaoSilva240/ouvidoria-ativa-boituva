"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";


interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
}

export function FormInput({ label, icon: Icon, className, ...props }: FormInputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-xl font-bold text-grafite">{label}</label>
            <div className="relative flex items-center">
                {Icon && (
                    <div className="absolute left-6 text-slate-400">
                        <Icon className="w-6 h-6" />
                    </div>
                )}
                <input
                    {...props}
                    className={cn(
                        "w-full h-20 rounded-2xl border-2 border-slate-100 bg-white px-6 py-4 text-xl text-grafite transition-all outline-none focus:border-primary",
                        Icon && "pl-16",
                        className
                    )}
                />
            </div>
        </div>
    );
}
