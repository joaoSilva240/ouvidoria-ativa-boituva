"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { ActionCard } from "@/components/ActionCard";

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col transition-colors duration-300">
            <Navbar />

            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-8">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-text-primary mb-3">
                        Olá! Como podemos ajudar hoje?
                    </h1>
                    <p className="text-xl text-text-secondary font-medium">
                        Selecione uma das opções abaixo
                    </p>
                </header>

                {/* Action Cards Section */}
                <section className="flex flex-col gap-6 w-[80%] max-w-4xl">
                    <Link href="/registro/identificacao" className="w-full">
                        <ActionCard
                            title="Registrar Nova Manifestação"
                            subtitle="Faça elogios, sugestões ou denúncias"
                            icon={Plus}
                            variant="primary"
                        />
                    </Link>
                    <Link href="/consulta" className="w-full">
                        <ActionCard
                            title="Consultar Manifestação"
                            subtitle="Acompanhe o status do seu pedido"
                            icon={Search}
                            variant="grafite"
                        />
                    </Link>
                </section>

                {/* Footer Section */}
                <footer className="mt-auto pt-12 text-center">
                    <div className="flex items-center justify-center gap-8 text-text-secondary font-medium text-xs">
                        <span>© 2026 Boituva</span>
                        <span>Privacidade</span>
                        <span>Termos</span>
                    </div>
                </footer>
            </div>
        </main>
    );
}
