"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(login, null);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">Bem-vindo de volta!</h2>
                <p className="text-text-secondary">
                    Acesse sua conta para acompanhar suas manifestações ou registrar uma nova.
                </p>
            </div>

            <form action={formAction} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary" htmlFor="email">
                        E-mail
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-color bg-bg-secondary text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-secondary/50"
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary" htmlFor="password">
                        Senha
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="w-full h-12 pl-12 pr-12 rounded-xl border border-border-color bg-bg-secondary text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-secondary/50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer text-text-secondary select-none">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border-color text-primary focus:ring-primary bg-bg-secondary"
                        />
                        <span>Lembrar de mim</span>
                    </label>
                    <Link href="#" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                        Esqueceu a senha?
                    </Link>
                </div>

                {/* Error Message */}
                {errorMessage?.error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-2">
                        <span>⚠️</span>
                        <span>{errorMessage.error}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Entrar na Ouvidoria
                            <LogIn className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-text-secondary text-sm">
                    Ainda não tem cadastro?{" "}
                    <Link href="/cadastro" className="text-primary font-bold hover:underline">
                        Crie sua conta
                    </Link>
                </p>
            </div>
        </div>
    );
}
