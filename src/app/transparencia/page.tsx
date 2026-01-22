"use client";

import { useEffect, useState } from "react";
import { BarChart3, MessageSquare, Clock, ThumbsUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TypeChart } from "@/components/dashboard/TypeChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { getDashboardData, DashboardStats } from "@/app/actions/dashboard";
import Image from "next/image";
import Link from "next/link";

const filterOptions = [
    { label: "Últimos 30 dias", value: "30dias" },
    { label: "Este Ano", value: "ano" },
    { label: "Total", value: "total" },
];

export default function TransparenciaPage() {
    const [activeFilter, setActiveFilter] = useState("30dias");
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getDashboardData(activeFilter);
            setStats(data);
            setLoading(false);
        }
        fetchData();
    }, [activeFilter]);

    if (loading || !stats) {
        return (
            <div className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
                    <p className="mt-4 text-grafite font-semibold text-lg">Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 py-8 px-6">
            {/* Header */}
            <header className="flex flex-col items-center gap-4 mb-8">
                <div className="flex flex-col items-center">
                    <Image
                        src="/logo-boituva.png"
                        alt="Boituva"
                        width={400}
                        height={120}
                        priority
                        className="h-20 w-auto mb-2"
                    />
                    <p className="text-grafite/50 text-xs font-semibold tracking-[0.3em]">OUVIDORIA DIGITAL</p>
                </div>
                <h1 className="text-4xl font-extrabold text-grafite text-center">
                    Transparência Boituva
                </h1>
            </header>

            {/* Stats Grid */}
            <section className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={MessageSquare}
                        label="Total de Manifestações"
                        value={stats.totalManifestacoes.toLocaleString()}
                        color="primary"
                    />
                    <StatCard
                        icon={BarChart3}
                        label="Taxa de Resposta"
                        value={stats.taxaResposta}
                        color="green"
                    />
                    <StatCard
                        icon={Clock}
                        label="Tempo Médio"
                        value={stats.tempoMedio}
                        color="primary"
                    />
                    <StatCard
                        icon={ThumbsUp}
                        label="Nível de Satisfação"
                        value={stats.nivelSatisfacao}
                        color="yellow"
                    />
                </div>
            </section>

            {/* Timeline Chart */}
            <section className="max-w-7xl mx-auto mb-8">
                <TimelineChart data={stats.evolucaoTemporal} periodo={activeFilter} />
            </section>

            {/* Charts Section */}
            <section className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TypeChart data={stats.distribuicaoPorTipo} />
                    <DepartmentChart data={stats.distribuicaoPorSecretaria} />
                </div>
            </section>

            {/* Filters */}
            <section className="max-w-7xl mx-auto mb-8">
                <DashboardFilters
                    filters={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
            </section>

            {/* Back Button */}
            <footer className="max-w-7xl mx-auto text-center">
                <Link
                    href="/"
                    className="inline-block bg-grafite text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-grafite/90 transition-colors"
                >
                    Voltar ao Início
                </Link>
            </footer>
        </main>
    );
}
