"use server";

import { createClient } from "@/utils/supabase/server";

export interface DashboardStats {
    totalManifestacoes: number;
    taxaResposta: string;
    tempoMedio: string;
    nivelSatisfacao: string;
    distribuicaoPorTipo: Array<{ name: string; value: number; color: string }>;
    distribuicaoPorSecretaria: Array<{ name: string; manifestacoes: number }>;
}

export async function getDashboardData(periodo: string): Promise<DashboardStats> {
    const supabase = await createClient();

    // Calcular data de início baseado no período
    const now = new Date();
    let startDate = new Date();

    switch (periodo) {
        case "30dias":
            startDate.setDate(now.getDate() - 30);
            break;
        case "ano":
            startDate.setMonth(0, 1); // 1º de janeiro do ano atual
            break;
        case "total":
        default:
            startDate = new Date(2020, 0, 1); // Data arbitrária antiga
            break;
    }

    try {
        // 1. Total de manifestações no período
        const { count: totalManifestacoes } = await supabase
            .from("manifestacoes")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startDate.toISOString());

        // 2. Distribuição por tipo
        const { data: tipoData } = await supabase
            .from("manifestacoes")
            .select("tipo")
            .gte("created_at", startDate.toISOString());

        const tipoCounts: Record<string, number> = {};
        tipoData?.forEach((item) => {
            tipoCounts[item.tipo] = (tipoCounts[item.tipo] || 0) + 1;
        });

        const colorMap: Record<string, string> = {
            "ELOGIO": "#10B981", // Verde Natureza
            "SUGESTAO": "#F59E0B", // Amarelo Aventura
            "RECLAMACAO": "#78350F", // Marrom Cidade
            "DENUNCIA": "#334155", // Grafite
            "OUTROS": "#94a3b8", // Slate
        };

        const distribuicaoPorTipo = Object.entries(tipoCounts).map(([tipo, count]) => ({
            name: tipo.charAt(0) + tipo.slice(1).toLowerCase(),
            value: count,
            color: colorMap[tipo] || "#0EA5E9",
        }));

        // 3. Distribuição por secretaria
        const { data: secretariaData } = await supabase
            .from("manifestacoes")
            .select("secretaria")
            .gte("created_at", startDate.toISOString());

        const secretariaCounts: Record<string, number> = {};
        secretariaData?.forEach((item) => {
            secretariaCounts[item.secretaria] = (secretariaCounts[item.secretaria] || 0) + 1;
        });

        const distribuicaoPorSecretaria = Object.entries(secretariaCounts)
            .map(([secretaria, count]) => ({
                name: secretaria,
                manifestacoes: count,
            }))
            .sort((a, b) => b.manifestacoes - a.manifestacoes)
            .slice(0, 5); // Top 5 secretarias

        // 4. Taxa de resposta (simulada - você precisará ter um campo "respondida" na tabela)
        const taxaResposta = "95%";

        // 5. Tempo médio (simulado)
        const tempoMedio = "3 dias";

        // 6. Nível de satisfação (pode vir do campo "humor")
        const nivelSatisfacao = "4.5/5";

        return {
            totalManifestacoes: totalManifestacoes || 0,
            taxaResposta,
            tempoMedio,
            nivelSatisfacao,
            distribuicaoPorTipo,
            distribuicaoPorSecretaria,
        };
    } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);

        // Retornar dados vazios em caso de erro
        return {
            totalManifestacoes: 0,
            taxaResposta: "0%",
            tempoMedio: "N/A",
            nivelSatisfacao: "N/A",
            distribuicaoPorTipo: [],
            distribuicaoPorSecretaria: [],
        };
    }
}
