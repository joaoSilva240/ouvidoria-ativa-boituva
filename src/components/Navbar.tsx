"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "./Sidebar";

interface NavbarProps {
    showMenuButton?: boolean;
}

/**
 * Navbar unificada para todas as páginas do projeto.
 * Design: Logo à esquerda + botão menu à direita que abre Sidebar.
 */
export function Navbar({ showMenuButton = true }: NavbarProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <header className="w-full flex justify-between items-center py-6 px-12 bg-white/80 backdrop-blur-sm border-b border-slate-100 relative z-10">
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

                {showMenuButton && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-grafite font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                        aria-label="Abrir menu"
                    >
                        <Menu className="w-5 h-5" />
                        Menu
                    </button>
                )}
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
}

