"use server";

import { createClient } from "@/utils/supabase/server";
import { getOrSet, invalidateCache, invalidatePattern } from "@/utils/redis";

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
                id: cachedData.id,
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

export interface MinhaManifestacao {
    id: string;
    protocolo: string;
    tipo: string;
    status: string;
    created_at: string;
    updated_at: string;
    secretaria: string;
}

/**
 * Busca todas as manifestações do cidadão logado.
 * Utiliza cache Redis por 5 minutos.
 */
export async function getMinhasManifestacoesAction(): Promise<{
    success: boolean;
    data?: MinhaManifestacao[];
    error?: string;
}> {
    const supabase = await createClient();

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    const cacheKey = `minhas-manifestacoes:${user.id}`;

    try {
        const data = await getOrSet(
            cacheKey,
            async () => {
                const { data: manifestacoes, error } = await supabase
                    .from("manifestacoes")
                    .select("id, protocolo, tipo, status, created_at, updated_at, secretaria")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (error) {
                    throw error;
                }

                return manifestacoes || [];
            },
            { ttl: MANIFESTACAO_CACHE_TTL }
        );

        return { success: true, data: data as MinhaManifestacao[] };
    } catch (e: any) {
        console.error("Erro ao buscar manifestações do cidadão:", e);
        return { success: false, error: "Erro ao buscar suas manifestações." };
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
    await invalidatePattern("dashboard:stats:*");
    await invalidatePattern("manifestacoes:list:*");

    return { success: true };
}
