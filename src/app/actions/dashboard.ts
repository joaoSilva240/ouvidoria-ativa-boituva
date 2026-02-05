"use server";

import { createClient } from "@/utils/supabase/server";
import { getOrSet } from "@/utils/redis";

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
    const cacheKey = `dashboard:stats:${periodo}`;

    // Cache por 10 minutos (600 segundos) para não sobrecarregar o banco
    return await getOrSet(cacheKey, async () => {
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

        // Mapeamento de nomes com acentuação correta
        const nomesTipos: Record<string, string> = {
            "elogio": "Elogio",
            "sugestao": "Sugestão",
            "reclamacao": "Reclamação",
            "denuncia": "Denúncia",
            "informacao": "Informação",
        };

        const distribuicaoPorTipo = Object.entries(tipoCounts).map(([tipo, count]) => ({
            name: nomesTipos[tipo.toLowerCase()] || tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase(),
            value: count,
            color: colorMap[tipo.toLowerCase()] || "#0EA5E9",
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
            .sort((a, b) => b.manifestacoes - a.manifestacoes);

        // 4. Taxa de resposta REAL
        const { count: respondidas } = await supabase
            .from("manifestacoes")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startDate.toISOString())
            .eq("status", "CONCLUIDO");

        const taxaRespostaNum = totalManifestacoes && totalManifestacoes > 0
            ? Math.round((respondidas! / totalManifestacoes) * 100)
            : 0;
        const taxaResposta = `${taxaRespostaNum}%`;

        // 5. Tempo médio de resposta REAL
        const { data: manifestacoesConcluidas } = await supabase
            .from("manifestacoes")
            .select("created_at, updated_at")
            .gte("created_at", startDate.toISOString())
            .eq("status", "CONCLUIDO");

        let tempoMedio = "N/A";
        if (manifestacoesConcluidas && manifestacoesConcluidas.length > 0) {
            const temposTotais = manifestacoesConcluidas.map((m) => {
                const criacao = new Date(m.created_at);
                const conclusao = new Date(m.updated_at);
                return (conclusao.getTime() - criacao.getTime()) / (1000 * 60 * 60 * 24); // Converter para dias
            });

            const mediaEmDias = temposTotais.reduce((a, b) => a + b, 0) / temposTotais.length;
            tempoMedio = mediaEmDias < 1
                ? "< 1 dia"
                : `${Math.round(mediaEmDias)} dia${Math.round(mediaEmDias) !== 1 ? 's' : ''}`;
        }

        // 6. Nível de satisfação REAL (baseado na satisfação pós-resposta)
        const { data: satisfacaoData } = await supabase
            .from("manifestacoes")
            .select("satisfacao_resposta")
            .gte("created_at", startDate.toISOString())
            .eq("status", "CONCLUIDO")
            .not("satisfacao_resposta", "is", null);

        let nivelSatisfacao = "N/A";
        if (satisfacaoData && satisfacaoData.length > 0) {
            const satisfacaoMap: Record<string, number> = {
                "feliz": 5,
                "normal": 3,
                "chateado": 2,
                "bravo": 1,
            };

            const notas = satisfacaoData
                .map((s) => satisfacaoMap[s.satisfacao_resposta] || 3)
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
    }, { ttl: 600 }); // Fim do getOrSet
}
