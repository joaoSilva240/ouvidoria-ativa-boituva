"use client";

import { motion } from "framer-motion";

interface FilterButton {
    label: string;
    value: string;
}

interface DashboardFiltersProps {
    filters: FilterButton[];
    activeFilter: string;
    onFilterChange: (value: string) => void;
}

export function DashboardFilters({ filters, activeFilter, onFilterChange }: DashboardFiltersProps) {
    return (
        <div className="flex gap-4 justify-center items-center">
            {filters.map((filter) => (
                <motion.button
                    key={filter.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onFilterChange(filter.value)}
                    className={`
                        px-8 py-4 rounded-full font-semibold text-lg transition-all min-w-[180px]
                        ${activeFilter === filter.value
                            ? "bg-primary text-white shadow-lg"
                            : "bg-bg-card text-text-primary border-2 border-border-color hover:border-primary/50 hover:bg-bg-secondary"
                        }
                    `}
                >
                    {filter.label}
                </motion.button>
            ))}
        </div>
    );
}
