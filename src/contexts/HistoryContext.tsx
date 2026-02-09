"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

interface HistoryItem {
    protocolo: string;
    tipo: string;
    timestamp: number;
}

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (protocolo: string, tipo: string) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = "ouvidoria-history";
const MAX_ITEMS = 10;

export function HistoryProvider({ children }: { children: ReactNode }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [mounted, setMounted] = useState(false);

    // Carregar histórico do localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch {
                setHistory([]);
            }
        }
        setMounted(true);
    }, []);

    // Persistir no localStorage
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history, mounted]);

    const addToHistory = useCallback((protocolo: string, tipo: string) => {
        setHistory(prev => {
            // Verificar se já existe no topo (evitar duplicatas consecutivas)
            if (prev.length > 0 && prev[0].protocolo === protocolo) {
                return prev;
            }
            // Remover duplicata se existir em outra posição
            const filtered = prev.filter(item => item.protocolo !== protocolo);
            // Adicionar no início
            const updated = [
                { protocolo, tipo, timestamp: Date.now() },
                ...filtered
            ].slice(0, MAX_ITEMS);
            return updated;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    return (
        <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
}
