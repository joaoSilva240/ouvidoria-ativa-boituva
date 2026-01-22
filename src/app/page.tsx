"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { ActionCard } from "@/components/ActionCard";
import { SentimentWidget } from "@/components/SentimentWidget";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 flex flex-col items-center justify-between py-12 px-6 overflow-hidden">

            {/* Header Section */}
            <header className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center">
                    <h1 className="text-5xl font-bold text-grafite tracking-tighter">Boituva</h1>
                    <p className="text-grafite/50 text-sm font-semibold tracking-[0.3em] ml-1">OUVIDORIA DIGITAL</p>
                </div>
                <h2 className="text-3xl font-bold text-grafite mt-2">Olá! Como podemos ajudar hoje?</h2>
            </header>

            {/* Action Cards Section */}
            <section className="flex flex-col gap-6 w-full items-center">
                <Link href="/registro/identificacao" className="w-full max-w-2xl">
                    <ActionCard
                        title="Registrar Nova Manifestação"
                        subtitle="Faça elogios, sugestões ou denúncias"
                        icon={Plus}
                        variant="primary"
                    />
                </Link>
                <ActionCard
                    title="Consultar Manifestação"
                    subtitle="Acompanhe o status do seu pedido"
                    icon={Search}
                    variant="grafite"
                />
            </section>

            {/* Sentiment Widget Section */}
            <section className="w-full flex justify-center">
                <SentimentWidget />
            </section>

            {/* Footer Section */}
            <footer className="w-full text-center">
                <p className="text-slate-400 font-medium text-sm">
                    Toque em uma opção para começar • © 2026 Boituva
                </p>
            </footer>

        </main>
    );
}