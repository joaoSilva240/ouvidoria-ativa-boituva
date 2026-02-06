-- Migration: Corrigir segurança da função RPC
-- Data: 2026-02-06
-- Problema: Função usava SECURITY DEFINER, bypassando RLS
-- Solução: Alterar para SECURITY INVOKER

CREATE OR REPLACE FUNCTION public.get_manifestacao_details_by_protocol(p_protocolo text)
RETURNS SETOF manifestacoes
LANGUAGE plpgsql
SECURITY INVOKER  -- Agora respeita RLS
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.manifestacoes
  WHERE protocolo = UPPER(TRIM(p_protocolo));
END;
$function$;

-- Comentário para documentação
COMMENT ON FUNCTION public.get_manifestacao_details_by_protocol IS 
'Busca manifestação por protocolo. Usa SECURITY INVOKER para respeitar políticas RLS.';
