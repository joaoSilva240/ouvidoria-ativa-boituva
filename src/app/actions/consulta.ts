"use server";

import { adminClient } from "@/utils/supabase/admin";

export async function getManifestacaoByProtocol(protocolo: string) {
    // 1. Validação básica
    if (!protocolo || protocolo.trim().length < 8) {
        return { success: false, error: "Protocolo inválido." };
    }

    // 2. Busca usando o Cliente Admin (Service Role) - Ignora RLS
    try {
        const { data, error } = await adminClient
            .from("manifestacoes")
            .select(`
                id,
                protocolo,
                tipo,
                secretaria,
                endereco,
                relato,
                status,
                created_at,
                updated_at,
                anexos
            `)
            .eq("protocolo", protocolo.trim().toUpperCase())
            .single();

        if (error || !data) {
            // Se erro for PgrstError com code 'PGRST116' significa 0 rows (não encontrado)
            if (error?.code === 'PGRST116') {
                return { success: false, error: "Manifestação não encontrada." };
            }
            console.error("Erro na consulta:", error);
            return { success: false, error: "Erro ao consultar o banco de dados." };
        }

        // 3. Retorno de Dados Públicos
        return {
            success: true,
            data: {
                protocolo: data.protocolo,
                status: data.status,
                data_criacao: data.created_at,
                ultima_atualizacao: data.updated_at,
                tipo: data.tipo,
                secretaria: data.secretaria,
                relato: data.relato, // Decidir se mostramos o relato (público? sim, geralmente)
                endereco: data.endereco
            }
        };

    } catch (e) {
        console.error("Erro inesperado na consulta:", e);
        return { success: false, error: "Erro interno no servidor." };
    }
}
