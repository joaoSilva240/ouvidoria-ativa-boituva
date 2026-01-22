"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface TimelineData {
    data: string;
    manifestacoes: number;
}

interface TimelineChartProps {
    data: TimelineData[];
    periodo: string;
}

export function TimelineChart({ data, periodo }: TimelineChartProps) {
    // Formatar label do eixo X baseado no período
    const formatXAxis = (value: string) => {
        if (periodo === "30dias") {
            // Formato: DD/MM
            const [year, month, day] = value.split("-");
            return `${day}/${month}`;
        } else {
            // Formato: MMM/AAAA
            const [year, month] = value.split("-");
            const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            return `${monthNames[parseInt(month) - 1]}/${year}`;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-[24px] shadow-lg p-8"
        >
            <h3 className="text-2xl font-bold text-grafite mb-6">Evolução Temporal</h3>

            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorManifestacoes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="data"
                        tickFormatter={formatXAxis}
                        tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                        tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                        labelFormatter={(value) => `Data: ${formatXAxis(value)}`}
                        formatter={(value: number | undefined) => value !== undefined ? [value, "Manifestações"] : [0, "Manifestações"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="manifestacoes"
                        stroke="#0EA5E9"
                        strokeWidth={3}
                        fill="url(#colorManifestacoes)"
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
