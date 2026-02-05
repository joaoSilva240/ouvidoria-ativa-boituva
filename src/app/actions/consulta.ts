"use server";

import { createClient } from "@/utils/supabase/server";
import { getOrSet, invalidateCache } from "@/utils/redis";

const MANIFESTACAO_CACHE_TTL = 300; // 5 minutos

export async function getManifestacaoByProtocol(protocolo: string) {
    // 1. Validação básica
    if (!protocolo || protocolo.trim().length < 8) {
        return { success: false, error: "Protocolo inválido." };
    }

    const normalizedProtocolo = protocolo.trim().toUpperCase();
    const cacheKey = `manifestacao:${normalizedProtocolo}`;

    // 2. Busca com Cache Layer
    try {
        // A função getOrSet tenta buscar do Redis. Se falhar ou não existir, executa o fallback (Supabase)
        const cachedData = await getOrSet(
            cacheKey,
            async () => {
                const supabase = await createClient();
                const { data, error } = await supabase
                    .rpc('get_manifestacao_details_by_protocol', {
                        p_protocolo: normalizedProtocolo
                    })
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
                        anexos,
                        resposta_oficial,
                        satisfacao_resposta
                    `)
                    .single();

                if (error) {
                    // Se não encontrado, lançamos erro específico para tratar fora
                    if (error.code === 'PGRST116') {
                        throw new Error("NOT_FOUND");
                    }
                    throw error;
                }

                return data;
            },
            { ttl: MANIFESTACAO_CACHE_TTL }
        );

        if (!cachedData) {
            return { success: false, error: "Manifestação não encontrada." };
        }

        // 3. Retorno de Dados Formatados (Públicos)
        return {
            success: true,
            data: {
                protocolo: cachedData.protocolo,
                status: cachedData.status,
                data_criacao: cachedData.created_at,
                ultima_atualizacao: cachedData.updated_at,
                tipo: cachedData.tipo,
                secretaria: cachedData.secretaria,
                relato: cachedData.relato,
                endereco: cachedData.endereco,
                resposta_oficial: cachedData.resposta_oficial,
                satisfacao_resposta: cachedData.satisfacao_resposta
            }
        };

    } catch (e: any) {
        if (e.message === "NOT_FOUND") {
            return { success: false, error: "Manifestação não encontrada." };
        }
        console.error("Erro inesperado na consulta:", e);
        return { success: false, error: "Erro interno ou falha ao consultar." };
    }
}

export async function saveSatisfacaoResposta(protocolo: string, satisfacao: string) {
    const supabase = await createClient();
    const normalizedProtocolo = protocolo.trim().toUpperCase();

    // Validação
    const validSatisfacoes = ["feliz", "normal", "chateado", "bravo"];
    if (!validSatisfacoes.includes(satisfacao)) {
        return { success: false, error: "Satisfação inválida." };
    }

    const { error } = await supabase
        .from("manifestacoes")
        .update({ satisfacao_resposta: satisfacao })
        .eq("protocolo", normalizedProtocolo)
        .eq("status", "CONCLUIDO"); // Só permite se estiver concluído

    if (error) {
        console.error("Erro ao salvar satisfação:", error);
        return { success: false, error: "Erro ao salvar avaliação." };
    }

    // Invalidar cache para que update apareça imediatamente
    await invalidateCache(`manifestacao:${normalizedProtocolo}`);

    return { success: true };
}
