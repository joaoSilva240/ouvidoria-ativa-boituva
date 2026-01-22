-- Migration: Adiciona campos de resposta para cálculo de métricas reais
-- Data: 2026-01-22
-- Descrição: Campos necessários para calcular taxa de resposta e tempo médio

-- Adiciona campo para indicar se a manifestação foi respondida
ALTER TABLE manifestacoes
ADD COLUMN IF NOT EXISTS respondida BOOLEAN DEFAULT FALSE;

-- Adiciona campo para armazenar a data/hora da resposta
ALTER TABLE manifestacoes
ADD COLUMN IF NOT EXISTS data_resposta TIMESTAMP WITH TIME ZONE;

-- Comentários para documentação
COMMENT ON COLUMN manifestacoes.respondida IS 'Indica se a manifestação já recebeu uma resposta oficial da ouvidoria';
COMMENT ON COLUMN manifestacoes.data_resposta IS 'Data e hora em que a manifestação foi respondida (usado para calcular tempo médio de atendimento)';

-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_manifestacoes_respondida ON manifestacoes(respondida);
CREATE INDEX IF NOT EXISTS idx_manifestacoes_data_resposta ON manifestacoes(data_resposta);
