-- Migration: Migração de respostas antigas para o sistema de chat
-- Data: 2026-02-06
-- Descrição: Move o conteúdo dos campos legados (resposta_oficial e notas_internas) para a nova tabela mensagens_manifestacao

-- 1. Migrar Respostas Oficiais
INSERT INTO mensagens_manifestacao (manifestacao_id, tipo, conteudo, created_at, lida, autor_nome)
SELECT 
    id, 
    'RESPOSTA_OFICIAL', 
    resposta_oficial, 
    COALESCE(data_resposta, updated_at, NOW()),
    TRUE, -- Assumimos lida pois já estava lá
    'Ouvidoria (Migrado)'
FROM manifestacoes
WHERE 
    resposta_oficial IS NOT NULL 
    AND TRIM(resposta_oficial) != ''
    AND NOT EXISTS (
        SELECT 1 FROM mensagens_manifestacao 
        WHERE manifestacao_id = manifestacoes.id 
        AND tipo = 'RESPOSTA_OFICIAL' 
        AND conteudo = manifestacoes.resposta_oficial
    );

-- 2. Migrar Notas Internas
INSERT INTO mensagens_manifestacao (manifestacao_id, tipo, conteudo, created_at, lida, autor_nome)
SELECT 
    id, 
    'NOTA_INTERNA', 
    notas_internas, 
    updated_at, -- Melhor estimativa que temos
    TRUE,
    'Sistema (Migrado)'
FROM manifestacoes
WHERE 
    notas_internas IS NOT NULL 
    AND TRIM(notas_internas) != ''
    AND NOT EXISTS (
        SELECT 1 FROM mensagens_manifestacao 
        WHERE manifestacao_id = manifestacoes.id 
        AND tipo = 'NOTA_INTERNA' 
        AND conteudo = manifestacoes.notas_internas
    );

-- 3. Invalidação (Opcional, mas documental)
-- Não removemos as colunas originais ainda para garantir rollback se necessário.
-- Elas serão mantidas em sync pelas Actions por um tempo.

SELECT count(*) as migradas FROM mensagens_manifestacao WHERE autor_nome LIKE '%(Migrado)%';
