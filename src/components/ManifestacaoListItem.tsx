"use client";

import { cn } from "@/lib/utils";
import { FileText, Clock } from "lucide-react";

interface ManifestacaoListItemProps {
    protocolo: string;
    tipo: string;
    status: string;
    createdAt: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const TIPO_LABELS: Record<string, string> = {
    "ELOGIO": "Elogio",
    "SUGESTAO": "Sugestão",
    "RECLAMACAO": "Reclamação",
    "DENUNCIA": "Denúncia",
    "INFORMACAO": "Informação",
    "OUTROS": "Outros",
};

const STATUS_COLORS: Record<string, string> = {
    "PENDENTE": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "EM_ANALISE": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "CONCLUIDO": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "ARQUIVADO": "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400",
};

const STATUS_LABELS: Record<string, string> = {
    "PENDENTE": "Pendente",
    "EM_ANALISE": "Em Análise",
    "CONCLUIDO": "Concluído",
    "ARQUIVADO": "Arquivado",
};

export function ManifestacaoListItem({
    protocolo,
    tipo,
    status,
    createdAt,
    isSelected = false,
    onClick,
}: ManifestacaoListItemProps) {
    const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
    });

    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200",
                "hover:border-primary/50 hover:bg-primary/5",
                isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-bg-card border-border-color"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        )}
                    >
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-text-primary truncate">{protocolo}</p>
                        <p className="text-sm text-text-secondary">{TIPO_LABELS[tipo] || tipo}</p>
                    </div>
                </div>
                <span
                    className={cn(
                        "text-xs font-semibold px-2 py-1 rounded-lg shrink-0",
                        STATUS_COLORS[status] || "bg-slate-100 text-slate-700"
                    )}
                >
                    {STATUS_LABELS[status] || status}
                </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-text-secondary">
                <Clock className="w-3 h-3" />
                <span>{formattedDate}</span>
            </div>
        </button>
    );
}
