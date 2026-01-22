"use server";

import { createClient } from "@/utils/supabase/server";
import { ManifestacaoData } from "@/contexts/ManifestacaoContext";
import { redirect } from "next/navigation";

function generateProtocol() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `OUV-${year}-${random}`;
}

export async function saveManifestacao(data: ManifestacaoData) {
    const supabase = await createClient();

    // Validar sessão (mesmo anônima)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Erro de Autenticação no Server Action:", authError);
        return {
            success: false,
            error: `Falha na autenticação: ${authError?.message || "Sessão de usuário não encontrada."}. Verifique se a chave de API (ANON KEY) está correta.`
        };
    }

    const protocolo = generateProtocol();

    try {
        const payload = {
            protocolo: protocolo,
            user_id: user.id,
            tipo: data.categoria,
            secretaria: data.secretaria,
            endereco: data.endereco,
            relato: data.relato,
            identificacao_dados: data.identificacao,
            status: 'PENDENTE',
            // anexos: Implementar lógica de upload separada se necessário
        };

        const { error } = await supabase
            .from("manifestacoes")
            .insert(payload);

        if (error) {
            console.error("Erro ao salvar no Supabase:", error);
            return { success: false, error: "Erro ao salvar a manifestação. Tente novamente." };
        }

        return { success: true, protocolo: protocolo };
    } catch (e) {
        console.error("Erro inesperado:", e);
        return { success: false, error: "Erro interno no servidor." };
    }
}
