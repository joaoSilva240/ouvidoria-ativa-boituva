"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, Loader2, Mail, Phone, Fingerprint, UserPlus } from "lucide-react";
import { signup } from "@/app/actions/auth";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, null);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full py-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">Crie sua conta</h2>
                <p className="text-text-secondary">
                    Preencha os dados abaixo para começar a participar da gestão da nossa cidade.
                </p>
            </div>

            <form action={formAction} className="space-y-5">

                {/* Nome */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary" htmlFor="nome">
                        Nome Completo
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            id="nome"
                            name="nome"
                            type="text"
                            placeholder="Seu nome completo"
                            required
                            className="w-full h-11 pl-12 pr-4 rounded-xl border border-border-color bg-bg-secondary text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-secondary/50"
                        />
                    </div>
                </div>

                {/* CPF */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary" htmlFor="cpf">
                        CPF
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Fingerprint className="w-5 h-5" />
                        </div>
                        <input
                            id="cpf"
                            name="cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            required
                            className="w-full h-11 pl-12 pr-4 rounded-xl border border-border-color bg-bg-secondary text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-secondary/50"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary" htmlFor="email">
                        E-mail
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Mail className="w-5 h-5" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="exemplo@email.com"
                            required
                            className="w-full h-11 pl-12 pr-4 rounded-xl border border-border-color bg-bg-secondary text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-secondary/50"
                        />
                    </div>
                </div>

                {/* Telefone */}
                <div className="space-y-1">
                    <label className="text-sm font-bold text-text-primary" htmlFor="telefone">
                        Celular
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
                            <Phone className="w-5 h-5" />
                        </div>
                        <input
                            id="telefone"
                            name="telefone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                            className="w-full h-11 pl-12 pr-4 rounded-xl border border-border-color bg-bg-secondary text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-secondary/50"
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
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
                            placeholder="Min. 8 caracteres"
                            required
                            minLength={6}
                            className="w-full h-11 pl-12 pr-12 rounded-xl border border-border-color bg-bg-secondary text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-secondary/50"
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

                {/* Error / Success Messages */}
                {state?.error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-2">
                        <span>⚠️</span>
                        <span>{state.error}</span>
                    </div>
                )}

                {state?.message && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-100 dark:border-green-900/30 flex items-start gap-2">
                        <span>✓</span>
                        <span>{state.message}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] mt-4"
                >
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Criar minha conta
                            <UserPlus className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center pb-4">
                <p className="text-text-secondary text-sm">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Entre aqui
                    </Link>
                </p>
            </div>
        </div>
    );
}
