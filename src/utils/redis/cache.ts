import { getRedisClient } from "./client";

export interface CacheOptions {
    /** TTL em segundos. Padrão: 3600 (1 hora) */
    ttl?: number;
    /** Prefixo para a chave. Usado para organizar namespaces */
    prefix?: string;
}

const DEFAULT_TTL = 3600; // 1 hora
const DEFAULT_PREFIX = "oab"; // Ouvidoria Ativa Boituva

/**
 * Busca dados do cache. Se não encontrar, executa a função de fallback,
 * armazena o resultado no cache e o retorna.
 * 
 * Se o Redis não estiver disponível, apenas executa o fallback sem cache.
 */
export async function getOrSet<T>(
    key: string,
    fallback: () => Promise<T>,
    options: CacheOptions = {}
): Promise<T> {
    const { ttl = DEFAULT_TTL, prefix = DEFAULT_PREFIX } = options;
    const fullKey = `${prefix}:${key}`;

    let redis = null;

    try {
        redis = await getRedisClient();
    } catch (err) {
        console.warn("[Cache] Não foi possível obter cliente Redis. Usando fallback direto.", err);
    }

    // Se não houver Redis conectado, degrade gracefully para execução direta
    if (!redis || !redis.isOpen) {
        return await fallback();
    }

    try {
        // Tentar ler do cache
        const cached = await redis.get(fullKey);

        if (cached) {
            try {
                return JSON.parse(cached) as T;
            } catch (e) {
                console.error(`[Cache] Erro de parse JSON para chave ${fullKey}`, e);
            }
        }

        // Executar fallback
        const freshData = await fallback();

        // Armazenar no cache (background, não bloqueante se possível, mas await é seguro aqui)
        if (freshData !== undefined && freshData !== null) {
            try {
                await redis.setEx(fullKey, ttl, JSON.stringify(freshData));
            } catch (setErr) {
                console.error(`[Cache] Erro ao salvar chave ${fullKey}`, setErr);
            }
        }

        return freshData;
    } catch (error) {
        console.error(`[Cache] Erro geral ao acessar cache para ${fullKey}:`, error);
        // Em caso de erro crítico no Redis, retornar fallback
        return await fallback();
    }
}

/**
 * Invalida uma chave específica do cache.
 */
export async function invalidateCache(key: string, prefix = DEFAULT_PREFIX): Promise<void> {
    const fullKey = `${prefix}:${key}`;
    try {
        const redis = await getRedisClient();
        if (!redis || !redis.isOpen) return;

        await redis.del(fullKey);
    } catch (error) {
        console.error(`[Cache] Erro ao invalidar ${fullKey}:`, error);
    }
}

/**
 * Invalida chaves por padrão (usando SCAN para evitar bloquear o Redis se forem muitas chaves, 
 * mas KEYS é aceitável para volumes menores. O node-redis v4+ abstrai isso no .keys?
 * Na verdade .keys usa KEYS que é bloqueante. O ideal é usar SCAN.
 * Para simplificar nesta fase inicial, usaremos .keys, mas com cautela).
 */
export async function invalidatePattern(pattern: string, prefix = DEFAULT_PREFIX): Promise<void> {
    const fullPattern = `${prefix}:${pattern}`;
    try {
        const redis = await getRedisClient();
        if (!redis || !redis.isOpen) return;

        // TODO: Migrar para SCAN em produção com alto volume de chaves
        const keys = await redis.keys(fullPattern);

        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (error) {
        console.error(`[Cache] Erro ao invalidar padrão ${fullPattern}:`, error);
    }
}
