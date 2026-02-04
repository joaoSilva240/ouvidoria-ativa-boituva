"use client";

import Link from "next/link";
import { Plus, Search, BarChart3, LogOut } from "lucide-react";
import Image from "next/image";

import { ActionCard } from "@/components/ActionCard";
import { HeroPanel } from "@/components/HeroPanel";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Column - Actions (50%) */}
            <div className="relative w-full lg:w-1/2 flex flex-col justify-between py-12 px-8 lg:px-16 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-50">
                {/* Header Section */}
                <header className="flex flex-col items-center gap-6 mt-8 relative">
                    <div className="absolute top-6 right-6 z-10">
                        <button
                            onClick={() => {
                                fetch('/api/auth/signout', { method: 'POST' }).then(() => {
                                    window.location.href = '/login';
                                });
                            }}
                            className="flex items-center gap-2 text-slate-500 font-medium hover:bg-slate-100 px-4 py-2 rounded-full transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <Image
                            src="/logo-boituva.png"
                            alt="Boituva - Construindo progresso de mãos dadas"
                            width={400}
                            height={120}
                            priority
                            className="h-24 w-auto mb-2"
                        />
                        <p className="text-grafite/50 text-sm font-semibold tracking-[0.3em]">OUVIDORIA DIGITAL</p>
                    </div>
                    <h2 className="text-3xl font-bold text-grafite mt-2 text-center">Olá! Como podemos ajudar hoje?</h2>
                </header>

                {/* Action Cards Section */}
                <section className="flex flex-col gap-5 w-full items-center my-8">
                    <Link href="/registro/identificacao" className="w-full max-w-xl">
                        <ActionCard
                            title="Registrar Nova Manifestação"
                            subtitle="Faça elogios, sugestões ou denúncias"
                            icon={Plus}
                            variant="primary"
                        />
                    </Link>
                    <Link href="/consulta" className="w-full max-w-xl">
                        <ActionCard
                            title="Consultar Manifestação"
                            subtitle="Acompanhe o status do seu pedido"
                            icon={Search}
                            variant="grafite"
                        />
                    </Link>
                    <Link href="/transparencia" className="w-full max-w-xl">
                        <ActionCard
                            title="Painel de Transparência"
                            subtitle="Veja dados e estatísticas das manifestações"
                            icon={BarChart3}
                            variant="primary"
                        />
                    </Link>
                </section>

                {/* Footer Section */}
                <footer className="w-full text-center mb-4">
                    <div className="flex items-center justify-between text-slate-400 font-medium text-xs px-4">
                        <span>© 2026 Boituva</span>
                        <div className="flex gap-4">
                            <span>Privacidade</span>
                            <span>Termos</span>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Right Column - Image & Overlay (50%) */}
            <HeroPanel />
        </main>
    );
}
