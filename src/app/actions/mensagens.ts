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
export async function enviarMensagemOuvidor(
    manifestacaoId: string,
    conteudo: string,
    tipo: 'RESPOSTA_OFICIAL' | 'NOTA_INTERNA',
    autorNome: string = "Ouvidoria"
) {
    const supabase = await createClient();

    // Verificar autenticação (Ouvidor/Admin)
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
        throw new Error("Usuário não autenticado");
    }

    // Usar adminClient para insert garantido (bypass RLS se necessário ou garantir permissão)
    // Mas vamos usar o client normal se a policy estiver correta, ou admin se preferirmos robustez no server action
    // Dado que configuramos RLS para Profile, vamos usar adminClient para evitar complexidade de pegar Profile ID agora
    // e garantir consistência. Mas precisamos do ID do autor.

    const { error } = await adminClient
        .from("mensagens_manifestacao")
        .insert({
            manifestacao_id: manifestacaoId,
            autor_id: userData.user.id,
            autor_nome: autorNome,
            tipo: tipo,
            conteudo: conteudo,
            lida: false
        });

    if (error) {
        console.error("Erro ao enviar mensagem ouvidor:", error);
        throw new Error("Falha ao enviar mensagem");
    }

    // Se for resposta oficial, vamos também atualizar o status da manifestação para algo que indique movimento, se necessário
    // E atualizar campos legados se ainda existirem para compatibilidade (opcional, mas recomendado na transição)
    if (tipo === 'RESPOSTA_OFICIAL') {
        await adminClient.from("manifestacoes").update({
            respondida: true,
            data_resposta: new Date().toISOString(),
            // atualiza campo legado por compatibilidade temporária
            resposta_oficial: conteudo
        }).eq("id", manifestacaoId);
    }

    if (tipo === 'NOTA_INTERNA') {
        await adminClient.from("manifestacoes").update({
            // atualiza campo legado por compatibilidade temporária
            notas_internas: conteudo // isso sobrescreveria a nota anterior no campo legado, o que é aceitável na transição
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
    // Validar protocolo e pegar ID da manifestação
    const { data: manifestacao, error: fetchError } = await adminClient
        .from("manifestacoes")
        .select("id, status")
        .eq("protocolo", protocolo)
        .single();

    if (fetchError || !manifestacao) {
        throw new Error("Manifestação não encontrada");
    }

    if (manifestacao.status === 'ARQUIVADO') {
        throw new Error("Não é possível enviar mensagens para manifestação arquivada");
    }

    const { error } = await adminClient
        .from("mensagens_manifestacao")
        .insert({
            manifestacao_id: manifestacao.id,
            autor_id: null, // Anônimo/Cidadão sem login
            autor_nome: autorNome,
            tipo: 'CIDADAO',
            conteudo: conteudo,
            lida: false
        });

    if (error) {
        console.error("Erro ao enviar mensagem cidadão:", error);
        throw new Error("Falha ao enviar mensagem");
    }

    // Invalidar caches
    await invalidatePattern(`manifestacoes:${manifestacao.id}:mensagens`);

    return { success: true };
}
