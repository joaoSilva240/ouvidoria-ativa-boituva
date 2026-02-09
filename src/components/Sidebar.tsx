"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sun, Moon, LogOut, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTheme } from "@/contexts/ThemeContext";
import { useHistory } from "@/contexts/HistoryContext";
import { createClient } from "@/utils/supabase/client";

interface UserProfile {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    user_type: "COMUM" | "ADMIN";
}

async function fetchUserProfile(): Promise<UserProfile | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
        .from("profiles")
        .select("id, nome, cpf, email, telefone, user_type")
        .eq("id", user.id)
        .single();

    return data;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Hooks de contexto
    const { theme, toggleTheme } = useTheme();
    const { history } = useHistory();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['sidebar-profile'],
        queryFn: fetchUserProfile,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        onClose();
    };

    const handleHistoryClick = (protocolo: string) => {
        if (profile?.user_type === "ADMIN") {
            router.push(`/transparencia/manifestacoes/${protocolo}`);
        } else {
            router.push(`/consulta?protocolo=${protocolo}`);
        }
        onClose();
    };

    const getInitials = (name: string | null) => {
        if (!name) return "?";
        const parts = name.split(" ");
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    const maskCPF = (cpf: string | null) => {
        if (!cpf) return "***.***.***-**";
        const cleaned = cpf.replace(/\D/g, "");
        if (cleaned.length !== 11) return "***.***.***-**";
        return `***.${cleaned.substring(3, 6)}.***-**`;
    };

    // Não renderiza no servidor
    if (!mounted) return null;

    const sidebarContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[100]"
                    />

                    {/* Sidebar */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 350 }}
                        className="fixed right-0 top-0 h-full w-80 z-[101] flex flex-col shadow-2xl bg-white border-l border-slate-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-lg font-bold text-grafite">Menu</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-grafite" />
                            </button>
                        </div>

                        {/* Profile Section */}
                        <div className="p-5 border-b border-slate-100">
                            {isLoading ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="w-14 h-14 bg-slate-200 rounded-full" />
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                </div>
                            ) : profile ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
                                            {getInitials(profile.nome)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-grafite text-sm">{profile.nome}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${profile.user_type === "ADMIN"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-verde-natureza/10 text-verde-natureza"
                                                }`}>
                                                {profile.user_type === "ADMIN" ? "Ouvidor" : "Cidadão"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-slate-400 uppercase font-medium tracking-wide mb-0.5">CPF</p>
                                            <p className="text-grafite font-semibold">{maskCPF(profile.cpf)}</p>
                                        </div>
                                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-slate-400 uppercase font-medium tracking-wide mb-0.5">Telefone</p>
                                            <p className="text-grafite font-semibold">{profile.telefone || "—"}</p>
                                        </div>
                                        <div className="col-span-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-slate-400 uppercase font-medium tracking-wide mb-0.5">Email</p>
                                            <p className="text-grafite font-semibold truncate">{profile.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-400 text-sm">Não autenticado</p>
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <div className="p-3 border-b border-slate-100">
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-slate-50"
                            >
                                {theme === "light" ? (
                                    <Moon className="w-5 h-5 text-slate-500" />
                                ) : (
                                    <Sun className="w-5 h-5 text-amarelo-aventura" />
                                )}
                                <span className="text-grafite font-medium text-sm">
                                    {theme === "light" ? "Modo Escuro" : "Modo Claro"}
                                </span>
                            </button>
                        </div>

                        {/* History */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Histórico Recente</h3>
                            </div>

                            {history.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-4">
                                    Nenhuma manifestação acessada
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {history.slice(0, 5).map((item) => (
                                        <button
                                            key={item.protocolo}
                                            onClick={() => handleHistoryClick(item.protocolo)}
                                            className="w-full text-left px-3 py-2.5 rounded-xl transition-colors hover:bg-slate-50 border border-slate-100"
                                        >
                                            <p className="font-mono text-xs text-primary font-bold">
                                                {item.protocolo}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {item.tipo} • {new Date(item.timestamp).toLocaleDateString("pt-BR")}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Logout */}
                        <div className="p-4 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                Sair da conta
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(sidebarContent, document.body);
}
