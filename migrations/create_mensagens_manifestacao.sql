-- Migration: Criação da tabela de mensagens para o sistema de chat
-- Data: 2026-02-06
-- Descrição: Cria tabela para armazenar histórico de comunicação entre ouvidoria e cidadão

-- Tabela de mensagens unificada
CREATE TABLE IF NOT EXISTS mensagens_manifestacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manifestacao_id UUID NOT NULL REFERENCES manifestacoes(id) ON DELETE CASCADE,
    autor_id UUID REFERENCES profiles(id),           -- NULL = cidadão anônimo ou sistema
    autor_nome VARCHAR(255),                         -- Nome do autor para exibição rápida
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('RESPOSTA_OFICIAL', 'NOTA_INTERNA', 'CIDADAO')),
    conteudo TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,                      -- Para saber se a outra parte leu
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_mensagens_manifestacao_id ON mensagens_manifestacao(manifestacao_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_tipo ON mensagens_manifestacao(tipo);
CREATE INDEX IF NOT EXISTS idx_mensagens_created_at ON mensagens_manifestacao(created_at);

-- Comentários
COMMENT ON TABLE mensagens_manifestacao IS 'Armazena todo o histórico de conversas e notas internas de uma manifestação';
COMMENT ON COLUMN mensagens_manifestacao.tipo IS 'Define a visibilidade e origem: RESPOSTA_OFICIAL (Ouvidor->Cidadão), NOTA_INTERNA (Privado Ouvidoria), CIDADAO (Cidadão->Ouvidor)';

-- RLS Policies (Row Level Security)
ALTER TABLE mensagens_manifestacao ENABLE ROW LEVEL SECURITY;

-- Policy 1: Ouvidores e Admins podem ver TUDO (Select)
CREATE POLICY "Ouvidores veem todas as mensagens" ON mensagens_manifestacao
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type IN ('ADMIN', 'OUVIDOR')
        )
    );

-- Policy 2: Cidadãos veem apenas mensagens públicas da sua manifestação (Select)
-- Nota: Isso requer que o cidadão esteja autenticado OU que a query seja feita com role de serviço quando anonimo
-- Para acesso público via protocolo, vamos usar functions ou client admin no server action
CREATE POLICY "Cidadãos veem mensagens publicas" ON mensagens_manifestacao
    FOR SELECT
    USING (
        tipo IN ('RESPOSTA_OFICIAL', 'CIDADAO')
        -- Idealmente validaríamos se o user é dono da manifestação, mas como temos acesso anônimo com protocolo, 
        -- o controle principal será feito na aplicação (Server Action)
    );

-- Policy 3: Ouvidores podem inserir qualquer mensagem (Insert)
CREATE POLICY "Ouvidores enviam mensagens" ON mensagens_manifestacao
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type IN ('ADMIN', 'OUVIDOR')
        )
    );

-- Policy 4: Cidadãos podem inserir apenas mensagens do tipo CIDADAO (Insert)
CREATE POLICY "Cidadãos enviam mensagens" ON mensagens_manifestacao
    FOR INSERT
    WITH CHECK (
        tipo = 'CIDADAO'
    );
