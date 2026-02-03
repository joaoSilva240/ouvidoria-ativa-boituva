-- Adicionar campo para armazenar a satisfação pós-resposta
ALTER TABLE manifestacoes 
ADD COLUMN satisfacao_resposta VARCHAR(20) NULL;

-- Comentário explicativo
COMMENT ON COLUMN manifestacoes.satisfacao_resposta IS 
'Satisfação do cidadão após receber a resposta da ouvidoria (feliz, normal, chateado, bravo)';
