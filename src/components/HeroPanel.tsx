"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";

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

export function HeroPanel() {
    const [currentCard, setCurrentCard] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentCard((prev) => (prev + 1) % FEATURE_CARDS.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
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
    );
}
