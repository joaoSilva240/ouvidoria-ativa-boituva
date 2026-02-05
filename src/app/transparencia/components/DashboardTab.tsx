"use client";

import { useEffect, useState } from "react";
import { BarChart3, MessageSquare, Clock, ThumbsUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { TypeChart } from "@/components/dashboard/TypeChart";
import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { TimelineChart } from "@/components/dashboard/TimelineChart";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getDashboardData, DashboardStats } from "@/app/actions/dashboard";

const filterOptions = [
    { label: "Últimos 30 dias", value: "30dias" },
    { label: "Este Ano", value: "ano" },
    { label: "Total", value: "total" },
];

export function DashboardTab() {
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
            <div className="flex items-center justify-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            {/* Stats Grid */}
            <section className="max-w-7xl mx-auto mb-8 pt-6 px-6">
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
            <section className="max-w-7xl mx-auto mb-8 px-6">
                <TimelineChart data={stats.evolucaoTemporal} periodo={activeFilter} />
            </section>

            {/* Charts Section */}
            <section className="max-w-7xl mx-auto mb-8 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TypeChart data={stats.distribuicaoPorTipo} />
                    <DepartmentChart data={stats.distribuicaoPorSecretaria} />
                </div>
            </section>

            {/* Filters */}
            <section className="max-w-7xl mx-auto mb-8 px-6">
                <DashboardFilters
                    filters={filterOptions}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />
            </section>
        </>
    );
}
