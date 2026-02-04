"use client";

import { useEffect, useState } from "react";
import { BarChart3, MessageSquare, Clock, ThumbsUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TypeChart } from "@/components/dashboard/TypeChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageHeader } from "@/components/PageHeader";
import { getDashboardData, DashboardStats } from "@/app/actions/dashboard";
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
        return <LoadingSpinner message="Carregando dados..." />;
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 py-8 px-6">
            <PageHeader title="Transparência Boituva" />

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
            <footer className="max-w-7xl mx-auto text-center space-y-4">
                <Link
                    href="/transparencia/manifestacoes"
                    className="inline-block bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors"
                >
                    Ver Todas as Manifestações
                </Link>
                <div>
                    <Link
                        href="/"
                        className="inline-block bg-grafite text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-grafite/90 transition-colors"
                    >
                        Voltar ao Início
                    </Link>
                </div>
            </footer>
        </main>
    );
}
