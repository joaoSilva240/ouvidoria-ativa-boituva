"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
    backHref?: string;       // URL de destino do botão voltar (default: "/")
    backLabel?: string;      // Texto do botão (default: "Voltar")
    showBackButton?: boolean; // Controle de visibilidade (default: true)
}

/**
 * Navbar unificada para todas as páginas do projeto.
 * Design: Logo à esquerda + botão "Voltar" à direita.
 */
export function Navbar({
    backHref = "/",
    backLabel = "Voltar",
    showBackButton = true
}: NavbarProps) {
    return (
        <header className="w-full flex justify-between items-center py-6 px-12 bg-white/50 backdrop-blur-sm border-b border-slate-100">
            <Link href="/" className="flex items-center">
                <Image
                    src="/logo-boituva.png"
                    alt="Boituva - Ouvidoria Digital"
                    width={200}
                    height={60}
                    priority
                    className="h-12 w-auto"
                />
            </Link>

            {showBackButton && (
                <Link
                    href={backHref}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-slate-200 text-grafite font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                    {backLabel}
                </Link>
            )}
        </header>
    );
}
