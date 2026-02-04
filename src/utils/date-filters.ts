/**
 * Utility functions for calculating date ranges based on period filters.
 * Used by dashboard and manifestacoes actions.
 */

export type PeriodFilter = "7DIAS" | "30DIAS" | "30dias" | "ANO" | "ano" | "TOTAL" | "total";

/**
 * Calculate the start date for a given period filter.
 * @param periodo - The period filter string
 * @returns Date object for start of period, or null if no filter should be applied
 */
export function getStartDateForPeriod(periodo: string): Date | null {
    if (!periodo || periodo.toUpperCase() === "TOTAL") {
        return null;
    }

    const now = new Date();

    switch (periodo.toUpperCase()) {
        case "7DIAS":
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case "30DIAS":
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case "ANO":
            return new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
        default:
            return null;
    }
}

/**
 * Get ISO string for start date of a period, ready for database queries.
 * @param periodo - The period filter string
 * @returns ISO date string or null
 */
export function getStartDateISO(periodo: string): string | null {
    const date = getStartDateForPeriod(periodo);
    return date ? date.toISOString() : null;
}
