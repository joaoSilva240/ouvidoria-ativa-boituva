"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DepartmentData {
    name: string;
    manifestacoes: number;
}

interface DepartmentChartProps {
    data: DepartmentData[];
}

const SECRETARIA_COLORS = ["#0EA5E9", "#10B981", "#F59E0B"];

export function DepartmentChart({ data }: DepartmentChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-bg-card rounded-[24px] shadow-lg p-8 border border-border-color"
        >
            <h3 className="text-2xl font-bold text-text-primary mb-6">Manifestações por Secretaria</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "var(--text-secondary)", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <YAxis
                        tick={{ fill: "var(--text-secondary)", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "var(--border-color)" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--bg-card)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                        cursor={{ fill: "rgba(14, 165, 233, 0.1)" }}
                    />
                    <Bar
                        dataKey="manifestacoes"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={80}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SECRETARIA_COLORS[index % SECRETARIA_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
