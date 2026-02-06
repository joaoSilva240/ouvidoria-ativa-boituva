"use server";

import { createClient } from "@/utils/supabase/server";
import { adminClient } from "@/utils/supabase/admin";
import { invalidatePattern } from "@/utils/redis";
import { revalidatePath } from "next/cache";

export type TipoMensagem = "RESPOSTA_OFICIAL" | "NOTA_INTERNA" | "CIDADAO";

export interface Mensagem {
    id: string;
    manifestacao_id: string;
    autor_id: string | null;
    autor_nome: string | null;
    tipo: TipoMensagem;
    conteudo: string;
    lida: boolean;
    created_at: string;
}

/**
 * Busca todas as mensagens de uma manifestação.
 * Se o usuário for Cidadão (tipoUsuario = 'CIDADAO'), filtra notas internas.
 */
export async function getMensagens(manifestacaoId: string, tipoUsuario: 'OUVIDOR' | 'CIDADAO' = 'OUVIDOR') {
    const supabase = adminClient; // Usamos admin para garantir leitura consistência, filtramos manualmente ou via query

    let query = supabase
        .from("mensagens_manifestacao")
        .select("*")
        .eq("manifestacao_id", manifestacaoId)
        .order("created_at", { ascending: true });

    // Se for cidadão, NÃO pode ver notas internas
    if (tipoUsuario === 'CIDADAO') {
        query = query.neq("tipo", "NOTA_INTERNA");
    }

    const { data, error } = await query;

    if (error) {
        console.error("Erro ao buscar mensagens:", error);
        return [];
    }

    return data as Mensagem[];
}

/**
 * Envia uma mensagem por parte do Ouvidor (Pode ser Resposta Oficial ou Nota Interna)
 */
/**
 * Helper para verificar se pode enviar mensagem
 */
function podeEnviarMensagem(status: string) {
    return !['CONCLUIDO', 'ARQUIVADO'].includes(status);
}

/**
 * Envia uma mensagem por parte do Ouvidor (Pode ser Resposta Oficial ou Nota Interna)
 */
export async function enviarMensagemOuvidor(
    manifestacaoId: string,
    conteudo: string,
    tipo: 'RESPOSTA_OFICIAL' | 'NOTA_INTERNA',
    autorNome: string = "Ouvidoria" // Fallback se não encontrar no profile
) {
    const supabase = await createClient();

    // Verificar autenticação (Ouvidor/Admin)
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
        throw new Error("Usuário não autenticado");
    }

    // Verificar status da manifestação
    const { data: manifestacao, error: fetchError } = await adminClient
        .from("manifestacoes")
        .select("status")
        .eq("id", manifestacaoId)
        .single();

    if (fetchError || !manifestacao) throw new Error("Manifestação não encontrada");

    // Permite nota interna mesmo concluída? Geralmente sim, para registro. Mas Resposta Oficial não.
    // O pedido foi "chat trancado". Vamos bloquear tudo para simplificar user rule.
    if (!podeEnviarMensagem(manifestacao.status)) {
        throw new Error("Não é possível enviar mensagens para manifestação concluída ou arquivada.");
    }

    // Identificação do Ouvidor
    const nomeReal = userData.user.user_metadata?.nome ||
        userData.user.user_metadata?.full_name ||
        autorNome;

    const { error } = await adminClient
        .from("mensagens_manifestacao")
        .insert({
            manifestacao_id: manifestacaoId,
            autor_id: userData.user.id,
            autor_nome: nomeReal,
            tipo: tipo,
            conteudo: conteudo,
            lida: false
        });

    if (error) {
        console.error("Erro ao enviar mensagem ouvidor:", error);
        throw new Error("Falha ao enviar mensagem");
    }

    // Se for resposta oficial, vamos também atualizar o status da manifestação e data_resposta
    if (tipo === 'RESPOSTA_OFICIAL') {
        await adminClient.from("manifestacoes").update({
            respondida: true,
            data_resposta: new Date().toISOString(),
            resposta_oficial: conteudo // legado
        }).eq("id", manifestacaoId);
    }

    if (tipo === 'NOTA_INTERNA') {
        await adminClient.from("manifestacoes").update({
            notas_internas: conteudo // legado
        }).eq("id", manifestacaoId);
    }

    // Invalidar caches
    await invalidatePattern(`manifestacoes:${manifestacaoId}:mensagens`);

    return { success: true };
}

/**
 * Envia uma mensagem por parte do Cidadão (Via Portal de Consulta)
 */
export async function enviarMensagemCidadao(
    protocolo: string,
    conteudo: string,
    autorNome: string = "Cidadão"
) {
    try {
        // Validar protocolo e pegar ID da manifestação
        const { data: manifestacao, error: fetchError } = await adminClient
            .from("manifestacoes")
            .select("id, status, identificacao_dados")
            .eq("protocolo", protocolo)
            .single();

        if (fetchError) {
            console.error("Erro ao buscar manifestação:", fetchError);
            throw new Error("Manifestação não encontrada");
        }

        if (!manifestacao) {
            throw new Error("Manifestação não encontrada");
        }

        if (!podeEnviarMensagem(manifestacao.status)) {
            throw new Error("Não é possível enviar mensagens para manifestação concluída ou arquivada");
        }

        // Extrair nome do cidadão do JSONB identificacao_dados ou usar fallback
        const identificacao = manifestacao.identificacao_dados as { nome?: string } | null;
        const nomeReal = identificacao?.nome || autorNome || "Cidadão";

        const { error } = await adminClient
            .from("mensagens_manifestacao")
            .insert({
                manifestacao_id: manifestacao.id,
                autor_id: null,
                autor_nome: nomeReal,
                tipo: 'CIDADAO',
                conteudo: conteudo,
                lida: false
            });

        if (error) {
            console.error("Erro ao inserir mensagem cidadão:", error);
            throw new Error("Falha ao enviar mensagem: " + error.message);
        }

        // Invalidar caches
        await invalidatePattern(`manifestacoes:${manifestacao.id}:mensagens`);

        return { success: true };
    } catch (err: any) {
        console.error("Erro em enviarMensagemCidadao:", err);
        throw err;
    }
}

/**
 * Permite ao cidadão finalizar a manifestação se estiver satisfeito.
 */
export async function finalizarManifestacaoCidadao(protocolo: string) {
    const { data: manifestacao, error: fetchError } = await adminClient
        .from("manifestacoes")
        .select("id, status, identificacao_dados")
        .eq("protocolo", protocolo)
        .single();

    if (fetchError || !manifestacao) {
        throw new Error("Manifestação não encontrada");
    }

    if (manifestacao.status === 'CONCLUIDO' || manifestacao.status === 'ARQUIVADO') {
        throw new Error("Manifestação já está finalizada.");
    }

    // Extrair nome do cidadão do JSONB identificacao_dados ou usar fallback
    const identificacao = manifestacao.identificacao_dados as { nome?: string } | null;
    const nomeReal = identificacao?.nome || "Cidadão";

    // 1. Inserir mensagem de sistema/aviso
    await adminClient.from("mensagens_manifestacao").insert({
        manifestacao_id: manifestacao.id,
        tipo: 'RESPOSTA_OFICIAL', // Visível a todos
        conteudo: `Atendimento finalizado pelo Cidadão ${nomeReal}.`,
        autor_nome: "Sistema",
        lida: true
    });

    // 2. Atualizar status
    const { error } = await adminClient
        .from("manifestacoes")
        .update({
            status: 'CONCLUIDO',
            updated_at: new Date().toISOString()
        })
        .eq("id", manifestacao.id);

    if (error) throw new Error("Erro ao finalizar manifestação.");

    // Invalidar caches
    await invalidatePattern(`manifestacao:${protocolo}`); // Para consulta
    await invalidatePattern(`manifestacoes:${manifestacao.id}:mensagens`);

    return { success: true };
}

/**
 * Permite ao ouvidor finalizar a manifestação, inserindo mensagem de conclusão.
 */
export async function finalizarManifestacaoOuvidor(manifestacaoId: string) {
    const supabase = await createClient();

    // Verificar autenticação
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
        throw new Error("Usuário não autenticado");
    }

    const { data: manifestacao, error: fetchError } = await adminClient
        .from("manifestacoes")
        .select("id, status, protocolo")
        .eq("id", manifestacaoId)
        .single();

    if (fetchError || !manifestacao) {
        throw new Error("Manifestação não encontrada");
    }

    if (manifestacao.status === 'CONCLUIDO' || manifestacao.status === 'ARQUIVADO') {
        throw new Error("Manifestação já está finalizada.");
    }

    // Nome do ouvidor
    const nomeOuvidor = userData.user.user_metadata?.nome ||
        userData.user.user_metadata?.full_name ||
        "Ouvidor";

    // 1. Inserir mensagem de finalização
    await adminClient.from("mensagens_manifestacao").insert({
        manifestacao_id: manifestacao.id,
        autor_id: userData.user.id,
        tipo: 'RESPOSTA_OFICIAL',
        conteudo: `Este atendimento foi finalizado.`,
        autor_nome: nomeOuvidor,
        lida: true
    });

    // 2. Atualizar status
    const { error } = await adminClient
        .from("manifestacoes")
        .update({
            status: 'CONCLUIDO',
            updated_at: new Date().toISOString()
        })
        .eq("id", manifestacao.id);

    if (error) throw new Error("Erro ao finalizar manifestação.");

    // Invalidar caches
    await invalidatePattern(`manifestacao:${manifestacao.protocolo}`);
    await invalidatePattern(`manifestacoes:${manifestacao.id}:mensagens`);
    await invalidatePattern(`dashboard:stats:*`);

    return { success: true };
}
