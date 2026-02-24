"use client";

import { useState } from "react";
import { BarChart3, ClipboardList } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { DashboardTab } from "./components/DashboardTab";
import { ManifestacoesTab } from "./components/ManifestacoesTab";

type Tab = "dashboard" | "manifestacoes";

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function TabButton({ active, onClick, icon, children }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${active
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                }`}
        >
            {icon}
            {children}
        </button>
    );
}

export default function TransparenciaPage() {
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");

    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300 flex flex-col">
            <Navbar />

            <div className="flex-1">
                {/* Tab Navigation */}
                <div className="max-w-7xl mx-auto px-6 pt-6">
                    <div className="flex gap-2 bg-bg-card rounded-2xl p-2 shadow-sm border border-border-color w-fit">
                        <TabButton
                            active={activeTab === "dashboard"}
                            onClick={() => setActiveTab("dashboard")}
                            icon={<BarChart3 className="w-5 h-5" />}
                        >
                            Dashboard
                        </TabButton>
                        <TabButton
                            active={activeTab === "manifestacoes"}
                            onClick={() => setActiveTab("manifestacoes")}
                            icon={<ClipboardList className="w-5 h-5" />}
                        >
                            Manifestações
                        </TabButton>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "dashboard" ? <DashboardTab /> : <ManifestacoesTab />}
            </div>

            <SiteFooter />
        </main>
    );
}
