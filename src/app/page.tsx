"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Search, BarChart3, Check } from "lucide-react";
import Image from "next/image";

import { ActionCard } from "@/components/ActionCard";

const FEATURE_CARDS = [
    {
        title: "Transparência e Agilidade",
        description: "Acompanhe suas solicitações em tempo real e ajude a prefeitura a cuidar melhor da nossa cidade.",
    },
    {
        title: "Participação Cidadã",
        description: "Sua voz é fundamental para construirmos uma Boituva cada vez melhor para todos.",
    },
    {
        title: "Respostas Efetivas",
        description: "Tecnologia a serviço do cidadão para garantir soluções rápidas e um atendimento de qualidade.",
    },
];

export default function LandingPage() {
    const [currentCard, setCurrentCard] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentCard((prev) => (prev + 1) % FEATURE_CARDS.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="min-h-screen bg-white flex overflow-hidden">
            {/* Left Column - Actions (50%) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between py-12 px-8 lg:px-16 overflow-y-auto bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-50">
                {/* Header Section */}
                <header className="flex flex-col items-center gap-6 mt-8">
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
            <div className="hidden lg:block w-1/2 relative h-screen">
                {/* Background Image */}
                <Image
                    src="/imagem-home.jpg"
                    alt="Prefeitura de Boituva"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Overlay Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-16 pb-24 text-white">
                    {/* Badge */}
                    <div className="mb-6">
                        <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                            Ouvidoria Ativa Digital Municipal
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-bold leading-tight mb-8 drop-shadow-lg">
                        Construindo progresso <br />
                        <span className="text-primary">de mãos dadas.</span>
                    </h1>

                    {/* Feature Card Carousel */}
                    <div className="relative h-48 w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full absolute"
                            >
                                <div className="flex gap-4 items-start">
                                    <div className="bg-[#84cc16] p-2 rounded-lg shrink-0">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{FEATURE_CARDS[currentCard].title}</h3>
                                        <p className="text-white/80 text-sm leading-relaxed">
                                            {FEATURE_CARDS[currentCard].description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Carousel Indicators (Dynamic) */}
                    <div className="flex gap-2 mt-4">
                        {FEATURE_CARDS.map((_, index) => (
                            <motion.div
                                key={index}
                                initial={false}
                                animate={{
                                    width: currentCard === index ? 32 : 6,
                                    backgroundColor: currentCard === index ? "var(--color-primary)" : "rgba(255, 255, 255, 0.3)"
                                }}
                                className="h-1.5 rounded-full transition-colors duration-300"
                                style={{ backgroundColor: currentCard === index ? '#0EA5E9' : 'rgba(255, 255, 255, 0.3)' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}