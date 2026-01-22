"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { HumorType } from "@/components/SentimentWidget";

export type Identificacao = {
    mode: "identificado" | "anonimo";
    nome: string;
    contato: string;
};

export type ManifestacaoData = {
    identificacao: Identificacao;
    categoria: string | null; // Categoria ID
    relato: string;
    secretaria: string;
    endereco: string;
    arquivos: File[]; // Placeholder for future use
    humor: HumorType; // Mood tracking
};

interface ManifestacaoContextType {
    data: ManifestacaoData;
    setIdentificacao: (data: Identificacao) => void;
    setCategoria: (id: string) => void;
    setRelato: (text: string) => void;
    setSecretaria: (text: string) => void;
    setEndereco: (text: string) => void;
    addArquivo: (file: File) => void;
    removeArquivo: (index: number) => void;
    setHumor: (humor: HumorType) => void;
    reset: () => void;
}

const defaultData: ManifestacaoData = {
    identificacao: { mode: "identificado", nome: "", contato: "" },
    categoria: null,
    relato: "",
    secretaria: "",
    endereco: "",
    arquivos: [],
    humor: null,
};

const ManifestacaoContext = createContext<ManifestacaoContextType | undefined>(undefined);

export function ManifestacaoProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ManifestacaoData>(defaultData);

    const setIdentificacao = (identificacao: Identificacao) => {
        setData((prev) => ({ ...prev, identificacao }));
    };

    const setCategoria = (categoria: string) => {
        setData((prev) => ({ ...prev, categoria }));
    };

    const setRelato = (relato: string) => {
        setData((prev) => ({ ...prev, relato }));
    };

    const setSecretaria = (secretaria: string) => {
        setData((prev) => ({ ...prev, secretaria }));
    };

    const setEndereco = (endereco: string) => {
        setData((prev) => ({ ...prev, endereco }));
    };

    const addArquivo = (file: File) => {
        setData((prev) => ({ ...prev, arquivos: [...prev.arquivos, file] }));
    };

    const removeArquivo = (index: number) => {
        setData((prev) => ({
            ...prev,
            arquivos: prev.arquivos.filter((_, i) => i !== index),
        }));
    };

    const setHumor = (humor: HumorType) => {
        setData((prev) => ({ ...prev, humor }));
    };

    const reset = () => {
        setData(defaultData);
    };

    // Autenticação Anônima Automática
    const router = useRouter(); // Hook do Next.js

    useEffect(() => {
        const supabase = createClient();

        async function authenticate() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.log("Iniciando sessão anônima...");
                const { error } = await supabase.auth.signInAnonymously();
                if (error) {
                    console.error("Erro ao autenticar anonimamente:", error);
                } else {
                    console.log("Sessão anônima criada. Atualizando router...");
                    router.refresh(); // FORÇA O SERVIDOR A LER O NOVO COOKIE
                }
            }
        }

        authenticate();
    }, [router]);

    return (
        <ManifestacaoContext.Provider
            value={{
                data,
                setIdentificacao,
                setCategoria,
                setRelato,
                setSecretaria,
                setEndereco,
                addArquivo,
                removeArquivo,
                setHumor,
                reset,
            }}
        >
            {children}
        </ManifestacaoContext.Provider>
    );
}

export function useManifestacao() {
    const context = useContext(ManifestacaoContext);
    if (!context) {
        throw new Error("useManifestacao must be used within a ManifestacaoProvider");
    }
    return context;
}
