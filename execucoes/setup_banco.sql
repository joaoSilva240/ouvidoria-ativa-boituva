-- Criação do Enum para Status
CREATE TYPE status_manifestacao AS ENUM ('PENDENTE', 'EM_ANALISE', 'CONCLUIDO', 'ARQUIVADO');

-- Criação da Tabela de Manifestações
CREATE TABLE public.manifestacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    protocolo TEXT UNIQUE NOT NULL, -- Vamos gerar via trigger ou no backend
    user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(), -- Vincula ao usuário (anônimo ou logado)
    
    tipo TEXT NOT NULL, -- Elogio, Reclamação, etc.
    secretaria TEXT NOT NULL,
    endereco TEXT NOT NULL,
    relato TEXT NOT NULL,
    
    identificacao_dados JSONB DEFAULT '{}'::JSONB, -- { "mode": "anonimo" } ou { "mode": "identificado", "nome": "..." }
    
    status status_manifestacao DEFAULT 'PENDENTE',
    
    anexos TEXT[], -- Array de URLs ou caminhos do Storage
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) - Segurança Padrão
ALTER TABLE public.manifestacoes ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA (RLS)

-- 1. Permitir INSERT para qualquer usuário autenticado (incluindo anônimos)
-- O Supabase Auth Anônimo conta como 'authenticated'
CREATE POLICY "Qualquer usuário pode criar manifestação" 
ON public.manifestacoes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 2. Permitir SELECT apenas para o dono da manifestação
-- O usuário só vê o que ele mesmo criou (usando o user_id da sessão anônima)
CREATE POLICY "Usuário vê apenas suas próprias manifestações" 
ON public.manifestacoes 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Configurar Trigger para atualizar o campo updated_at automaticamente (Opcional, boa prática)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manifestacoes_updated_at
BEFORE UPDATE ON public.manifestacoes
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
