-- Migration: Add humor column to manifestacoes table
-- Description: Adds a column to track the user's mood when submitting a manifestation

ALTER TABLE manifestacoes 
ADD COLUMN IF NOT EXISTS humor VARCHAR(20);

-- Add comment to document the column
COMMENT ON COLUMN manifestacoes.humor IS 'Humor do cidadão ao registrar a manifestação (feliz, normal, chateado, bravo)';
