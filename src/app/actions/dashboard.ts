"use server";

import { createClient } from "@/utils/supabase/server";

export interface DashboardStats {
    totalManifestacoes: number;
    taxaResposta: string;
    tempoMedio: string;
    nivelSatisfacao: string;
    distribuicaoPorTipo: Array<{ name: string; value: number; color: string }>;
    distribuicaoPorSecretaria: Array<{ name: string; manifestacoes: number }>;
    evolucaoTemporal: Array<{ data: string; manifestacoes: number }>;
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
            "elogio": "#10B981",      // Verde Natureza
            "sugestao": "#F59E0B",    // Amarelo Aventura
            "reclamacao": "#F97316",  // Laranja
            "denuncia": "#334155",    // Grafite
            "informacao": "#0EA5E9",  // Azul Céu
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

        // 4. Taxa de resposta REAL
        const { count: respondidas } = await supabase
            .from("manifestacoes")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startDate.toISOString())
            .eq("respondida", true);

        const taxaRespostaNum = totalManifestacoes && totalManifestacoes > 0
            ? Math.round((respondidas! / totalManifestacoes) * 100)
            : 0;
        const taxaResposta = `${taxaRespostaNum}%`;

        // 5. Tempo médio de resposta REAL
        const { data: manifestacoesRespondidas } = await supabase
            .from("manifestacoes")
            .select("created_at, data_resposta")
            .gte("created_at", startDate.toISOString())
            .eq("respondida", true)
            .not("data_resposta", "is", null);

        let tempoMedio = "N/A";
        if (manifestacoesRespondidas && manifestacoesRespondidas.length > 0) {
            const temposTotais = manifestacoesRespondidas.map((m) => {
                const criacao = new Date(m.created_at);
                const resposta = new Date(m.data_resposta!);
                return (resposta.getTime() - criacao.getTime()) / (1000 * 60 * 60 * 24); // Converter para dias
            });

            const mediaEmDias = temposTotais.reduce((a, b) => a + b, 0) / temposTotais.length;
            tempoMedio = mediaEmDias < 1
                ? "< 1 dia"
                : `${Math.round(mediaEmDias)} dia${Math.round(mediaEmDias) !== 1 ? 's' : ''}`;
        }

        // 6. Nível de satisfação REAL (baseado no campo humor)
        const { data: humorData } = await supabase
            .from("manifestacoes")
            .select("humor")
            .gte("created_at", startDate.toISOString())
            .not("humor", "is", null);

        let nivelSatisfacao = "N/A";
        if (humorData && humorData.length > 0) {
            const humorMap: Record<string, number> = {
                "FELIZ": 5,
                "NEUTRO": 3,
                "TRISTE": 1,
            };

            const notas = humorData
                .map((h) => humorMap[h.humor] || 3)
                .filter((nota) => nota !== undefined);

            if (notas.length > 0) {
                const media = notas.reduce((a, b) => a + b, 0) / notas.length;
                nivelSatisfacao = `${media.toFixed(1)}/5`;
            }
        }

        // 7. Evolução temporal (agregação por dia/semana/mês)
        const { data: allManifestacoes } = await supabase
            .from("manifestacoes")
            .select("created_at")
            .gte("created_at", startDate.toISOString())
            .order("created_at", { ascending: true });

        const evolucaoTemporal: Array<{ data: string; manifestacoes: number }> = [];

        if (allManifestacoes && allManifestacoes.length > 0) {
            const dateCounts: Record<string, number> = {};

            // Determinar granularidade baseado no período
            const formatDate = (dateStr: string): string => {
                const date = new Date(dateStr);

                if (periodo === "30dias") {
                    // Agrupar por dia
                    return date.toISOString().split("T")[0];
                } else if (periodo === "ano") {
                    // Agrupar por mês
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    return `${year}-${month}`;
                } else {
                    // Total: agrupar por mês também
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    return `${year}-${month}`;
                }
            };

            // Contar manifestações por data
            allManifestacoes.forEach((m) => {
                const dateKey = formatDate(m.created_at);
                dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
            });

            // Converter para array e ordenar
            evolucaoTemporal.push(
                ...Object.entries(dateCounts)
                    .map(([data, manifestacoes]) => ({ data, manifestacoes }))
                    .sort((a, b) => a.data.localeCompare(b.data))
            );
        }


        return {
            totalManifestacoes: totalManifestacoes || 0,
            taxaResposta,
            tempoMedio,
            nivelSatisfacao,
            distribuicaoPorTipo,
            distribuicaoPorSecretaria,
            evolucaoTemporal,
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
            evolucaoTemporal: [],
        };
    }
}
