"use server";

import { createClient } from "@/utils/supabase/server";

export interface ManifestacaoListItem {
    id: number;
    protocolo: string;
    created_at: string;
    nome_cidadao: string | null;
    cpf: string | null;
    tipo: string;
    secretaria: string;
    status: string;
}

export interface ManifestacaoListResponse {
    data: ManifestacaoListItem[];
    total: number;
    page: number;
    totalPages: number;
}

export async function getManifestacoes(
    filters: {
        search?: string;
        tipo?: string;
        secretaria?: string;
        identidade?: string;
        periodo?: string;
    } = {},
    page: number = 1,
    perPage: number = 10
): Promise<ManifestacaoListResponse> {
    const supabase = await createClient();

    try {
        // Build query
        let query = supabase
            .from("manifestacoes")
            .select("id, protocolo, created_at, nome_cidadao, cpf, tipo, secretaria, status", { count: "exact" });

        // Apply search filter (protocolo, nome, or cpf)
        if (filters.search && filters.search.trim()) {
            const searchTerm = filters.search.trim();
            query = query.or(`protocolo.ilike.%${searchTerm}%,nome_cidadao.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`);
        }

        // Apply tipo filter
        if (filters.tipo && filters.tipo !== "TODOS") {
            query = query.eq("tipo", filters.tipo);
        }

        // Apply secretaria filter
        if (filters.secretaria && filters.secretaria !== "TODAS") {
            query = query.eq("secretaria", filters.secretaria);
        }

        // Apply identidade filter
        if (filters.identidade) {
            if (filters.identidade === "ANONIMO") {
                query = query.is("nome_cidadao", null);
            } else if (filters.identidade === "IDENTIFICADO") {
                query = query.not("nome_cidadao", "is", null);
            }
        }

        // Apply periodo filter
        if (filters.periodo && filters.periodo !== "TOTAL") {
            const now = new Date();
            let startDate = new Date();

            switch (filters.periodo) {
                case "7DIAS":
                    startDate.setDate(now.getDate() - 7);
                    break;
                case "30DIAS":
                    startDate.setDate(now.getDate() - 30);
                    break;
                case "ANO":
                    startDate.setMonth(0, 1);
                    break;
            }

            query = query.gte("created_at", startDate.toISOString());
        }

        // Apply pagination
        const start = (page - 1) * perPage;
        const end = start + perPage - 1;

        // Execute query with ordering
        const { data, error, count } = await query
            .order("created_at", { ascending: false })
            .range(start, end);

        if (error) {
            console.error("Error fetching manifestacoes:", error);
            return {
                data: [],
                total: 0,
                page,
                totalPages: 0,
            };
        }

        const total = count || 0;
        const totalPages = Math.ceil(total / perPage);

        return {
            data: data || [],
            total,
            page,
            totalPages,
        };
    } catch (e) {
        console.error("Unexpected error fetching manifestacoes:", e);
        return {
            data: [],
            total: 0,
            page,
            totalPages: 0,
        };
    }
}

// Get unique secretarias for filter dropdown
export async function getSecretarias(): Promise<string[]> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from("manifestacoes")
            .select("secretaria")
            .order("secretaria");

        if (error || !data) {
            return [];
        }

        // Get unique secretarias
        const unique = [...new Set(data.map(item => item.secretaria))];
        return unique.filter(s => s); // Remove empty values
    } catch (e) {
        console.error("Error fetching secretarias:", e);
        return [];
    }
}
