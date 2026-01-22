"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DepartmentData {
    name: string;
    manifestacoes: number;
}

interface DepartmentChartProps {
    data: DepartmentData[];
}

export function DepartmentChart({ data }: DepartmentChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-[24px] shadow-lg p-8"
        >
            <h3 className="text-2xl font-bold text-grafite mb-6">Manifestações por Secretaria</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                        tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "white",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                        cursor={{ fill: "rgba(14, 165, 233, 0.1)" }}
                    />
                    <Bar
                        dataKey="manifestacoes"
                        fill="#0EA5E9"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={80}
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
