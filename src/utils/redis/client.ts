import { createClient, SocketTimeoutError } from "redis";

// Adicionar tipo global para evitar erros de TS e reconexões em dev
declare global {
    var redisGlobal: ReturnType<typeof createClient> | undefined;
}

// Singleton instance local
let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient() {
    // Se já temos uma instância local conectada, retorna ela
    if (redisClient?.isOpen) {
        return redisClient;
    }

    // Em ambiente de desenvolvimento, verificar se existe instância global
    if (process.env.NODE_ENV !== "production" && globalThis.redisGlobal?.isOpen) {
        redisClient = globalThis.redisGlobal;
        return redisClient;
    }

    const url = process.env.REDIS_URL;

    // Se não houver URL configurada, retornamos null ou erro.
    // Como estamos integrando agora, pode ser que a env não esteja lá ainda.
    // Para evitar crashel o app inteiro se esquecerem a env, vamos lançar erro apenas se tentar usar.
    if (!url) {
        console.warn("[Redis] REDIS_URL não configurada. Funcionalidades de cache serão desabilitadas.");
        return null;
    }

    try {
        const client = createClient({
            url,
            socket: {
                connectTimeout: 10000,
                reconnectStrategy: (retries, cause) => {
                    if (cause instanceof SocketTimeoutError) {
                        console.warn("[Redis] SocketTimeoutError - não reconectando.");
                        return false;
                    }
                    if (retries > 10) {
                        console.error("[Redis] Máximo de tentativas de reconexão atingido.");
                        return new Error("Redis: Máximo de tentativas de reconexão atingido");
                    }
                    const delay = Math.min(Math.pow(2, retries) * 100, 5000); // Max 5s
                    const jitter = Math.floor(Math.random() * 200);
                    return delay + jitter;
                },
            },
        });

        client.on("error", (err) => {
            // Log de erro de conexão, mas não crashar a app
            console.error("[Redis] Erro de cliente:", err.message);
        });

        client.on("connect", () => {
            console.log("[Redis] Conectado com sucesso!");
        });

        await client.connect();

        redisClient = client;

        // Persistir no global em dev
        if (process.env.NODE_ENV !== "production") {
            globalThis.redisGlobal = client;
        }

        return redisClient;
    } catch (error) {
        console.error("[Redis] Falha ao conectar:", error);
        return null;
    }
}

export async function closeRedisConnection() {
    const client = redisClient || globalThis.redisGlobal;

    if (client) {
        try {
            if (client.isOpen) {
                await client.quit();
            }
        } catch (err) {
            console.error("[Redis] Erro ao fechar conexão:", err);
        } finally {
            redisClient = null;
            if (process.env.NODE_ENV !== "production") {
                globalThis.redisGlobal = undefined;
            }
            console.log("[Redis] Conexão encerrada.");
        }
    }
}
