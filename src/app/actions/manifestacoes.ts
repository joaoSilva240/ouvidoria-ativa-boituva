"use server";

import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";
import { invalidatePattern, getOrSet } from "@/utils/redis";

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
    // Gerar chave de cache única baseada nos parâmetros
    const filtersKey = JSON.stringify(filters);
    const cacheKey = `manifestacoes:list:${filtersKey}:p${page}:l${perPage}`;

    return await getOrSet(cacheKey, async () => {
        const supabase = await createClient();

        try {
            // Build query
            let query = supabase
                .from("manifestacoes")
                .select("id, protocolo, created_at, identificacao_dados, tipo, secretaria, status", { count: "exact" });

            // Apply search filter (protocolo, nome, or cpf/contato)
            if (filters.search && filters.search.trim()) {
                const searchTerm = filters.search.trim();
                query = query.or(`protocolo.ilike.%${searchTerm}%,identificacao_dados->>nome.ilike.%${searchTerm}%,identificacao_dados->>contato.ilike.%${searchTerm}%`);
            }

            // Apply tipo filter
            if (filters.tipo && filters.tipo !== "TODOS") {
                // Cuidado: filtros.tipo vem em UPPERCASE da UI, mas no DB pode estar em lowercase
                query = query.ilike("tipo", filters.tipo);
            }

            // Apply secretaria filter
            if (filters.secretaria && filters.secretaria !== "TODAS") {
                query = query.eq("secretaria", filters.secretaria);
            }

            // Apply identidade filter
            if (filters.identidade && filters.identidade !== "TODOS") {
                if (filters.identidade === "ANONIMO") {
                    query = query.eq("identificacao_dados->>mode", "anonimo");
                } else if (filters.identidade === "IDENTIFICADO") {
                    query = query.eq("identificacao_dados->>mode", "identificado");
                }
            }

            // ... (resto do código de período se mantém igual)
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

            // Map data to interface
            const mappedData: ManifestacaoListItem[] = (data || []).map((item: any) => ({
                id: item.id,
                protocolo: item.protocolo,
                created_at: item.created_at,
                nome_cidadao: item.identificacao_dados?.nome || null,
                cpf: item.identificacao_dados?.contato || null, // No context de Boituva, contato costuma ser o CPF/email
                tipo: item.tipo,
                secretaria: item.secretaria,
                status: item.status,
            }));

            const total = count || 0;
            const totalPages = Math.ceil(total / perPage);

            return {
                data: mappedData,
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
    }, { ttl: 300 }); // Fim do getOrSet
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

export async function getManifestacaoByProtocolo(protocolo: string) {
    // USING ADMIN CLIENT TO BYPASS RLS AND ENSURE RELATO IS FETCHED
    const supabase = adminClient;

    const { data, error } = await supabase
        .from("manifestacoes")
        .select("id, protocolo, created_at, identificacao_dados, tipo, secretaria, status, relato, resposta_oficial, notas_internas, endereco")
        .eq("protocolo", protocolo)
        .single();

    if (error) {
        console.error("Error fetching manifestacao:", error);
        return null;
    }

    // Map `identificacao_dados` to top-level fields
    const mappedData = {
        ...data,
        nome_cidadao: data.identificacao_dados?.nome || null,
        cpf: data.identificacao_dados?.contato || null, // Assuming contact often holds CPF/Email, check structure if needed
        contato: data.identificacao_dados?.contato || null,
        bairro: data.endereco || null, // Mapping endereco to bairro for UI
        tipo: data.tipo?.toUpperCase() || "OUTROS",
        status: data.status?.toUpperCase() || "PENDENTE",
    };

    return mappedData;
}

export async function updateManifestacaoStatus(id: string, status: string) {
    const supabase = await createClient(); // Para pegar o usuário logado
    const admin = adminClient; // Para escritas privilegiadas

    // 1. Verificar autenticação e pegar nome do usuário
    const { data: { user } } = await supabase.auth.getUser();

    let nomeAutor = "Sistema";
    let autorId = null;

    if (user) {
        nomeAutor = user.user_metadata?.nome || user.user_metadata?.full_name || "Ouvidoria";
        autorId = user.id;
    }

    // 2. Buscar protocolo para invalidar cache
    const { data: currentManifestacao } = await admin
        .from("manifestacoes")
        .select("protocolo")
        .eq("id", id)
        .single();

    const protocolo = currentManifestacao?.protocolo;

    // 3. Mapeamento de Labels para o Chat
    const STATUS_LABELS: Record<string, string> = {
        "PENDENTE": "Pendente",
        "EM_ANALISE": "Em Análise",
        "CONCLUIDO": "Concluído",
        "ARQUIVADO": "Arquivado"
    };

    const novoStatusLabel = STATUS_LABELS[status] || status;

    // 4. Atualizar Status
    const { error } = await admin
        .from("manifestacoes")
        .update({ status: status }) // DB uses uppercase ENUM
        .eq("id", id);

    if (error) {
        console.error("Error updating status:", error);
        throw new Error("Failed to update status");
    }

    // 5. Inserir Mensagem no Chat avisando da mudança
    await admin.from("mensagens_manifestacao").insert({
        manifestacao_id: id,
        autor_id: autorId,
        autor_nome: nomeAutor,
        tipo: 'RESPOSTA_OFICIAL',
        conteudo: `Status alterado para: ${novoStatusLabel}`,
        lida: true
    });

    // 6. Invalidar caches
    await invalidatePattern("dashboard:stats:*");
    await invalidatePattern("manifestacoes:list:*");
    await invalidatePattern(`manifestacoes:${id}:mensagens`);

    if (protocolo) {
        // Invalidar cache específico da manifestação
        await invalidatePattern(`manifestacao:${protocolo}*`);
    }

    return { success: true };
}

export async function sendManifestacaoResponse(id: string, resposta: string, notas: string, status: string = "CONCLUIDO") {
    // USING ADMIN CLIENT TO BYPASS RLS
    const supabase = adminClient;

    // Validação: não permitir CONCLUIDO sem resposta válida
    if (status === "CONCLUIDO" && (!resposta || resposta.trim() === "")) {
        throw new Error("Não é possível concluir sem uma resposta oficial válida.");
    }

    const updateData: any = {};
    if (resposta !== undefined) updateData.resposta_oficial = resposta.trim();
    if (notas !== undefined) updateData.notas_internas = notas;
    if (status) updateData.status = status; // DB uses uppercase ENUM

    // Update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
        .from("manifestacoes")
        .update(updateData)
        .eq("id", id);

    if (error) {
        console.error("Error sending response:", error);
        throw new Error("Failed to send response");
    }

    // Invalidar cache do dashboard
    await invalidatePattern("dashboard:stats:*");
    // Invalidar listagem
    await invalidatePattern("manifestacoes:list:*");

    return { success: true };
}
