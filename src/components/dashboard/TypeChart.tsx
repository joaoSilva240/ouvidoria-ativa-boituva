"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TypeData {
    name: string;
    value: number;
    color: string;
}

interface TypeChartProps {
    data: TypeData[];
}

export function TypeChart({ data }: TypeChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-bg-card rounded-[24px] shadow-lg p-8 border border-border-color text-text-primary"
        >
            <h3 className="text-2xl font-bold text-text-primary mb-6">Distribuição por Tipo</h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "var(--bg-card)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border-color)",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "14px",
                            fontWeight: 600
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
