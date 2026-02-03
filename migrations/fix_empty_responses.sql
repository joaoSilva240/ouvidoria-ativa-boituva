-- Corrigir manifestações que foram concluídas sem resposta válida
-- Revertendo para EM_ANALISE para que sejam tratadas corretamente
UPDATE manifestacoes 
SET status = 'EM_ANALISE' 
WHERE status = 'CONCLUIDO' 
  AND (resposta_oficial IS NULL OR resposta_oficial = '');
