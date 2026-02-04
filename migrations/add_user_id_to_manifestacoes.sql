-- Add user_id to manifestacoes
ALTER TABLE public.manifestacoes
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_manifestacoes_user_id ON public.manifestacoes(user_id);

-- RLS
ALTER TABLE public.manifestacoes ENABLE ROW LEVEL SECURITY;

-- Remove existing policies (to be safe and redefine strict ones)
DROP POLICY IF EXISTS "Public can insert manifestacoes" ON public.manifestacoes;
DROP POLICY IF EXISTS "Anyone can view manifestacoes" ON public.manifestacoes;
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.manifestacoes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.manifestacoes;

-- 1. INSERT: Permitir que qualquer um (anon ou logado) crie manifestações
CREATE POLICY "Enable insert for everyone"
  ON public.manifestacoes FOR INSERT
  WITH CHECK (true);

-- 2. SELECT:
--    - ADMIN: Vê tudo
--    - LOGADO (Comum): Vê apenas as suas (user_id = auth.uid())
--    - ANON: Não vê nada na listagem geral (segurança).
--      *Nota*: Consultas por protocolo específico devem ser feitas via Server Action com adminClient (bypass RLS)
--      para garantir que ninguém possa "varrer" os dados tentando chutar protocolos.

CREATE POLICY "Enable read access based on role and ownership"
  ON public.manifestacoes FOR SELECT
  USING (
    -- Admin vê tudo
    (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND user_type = 'ADMIN'
      )
    )
    OR
    -- Dono vê a sua
    (
      auth.uid() IS NOT NULL AND 
      user_id = auth.uid()
    )
  );

-- 3. UPDATE: Apenas Admins podem atualizar status via Client?
--    Geralmente updates de status são via Admin Dashboard.
--    O usuário comum pode editar? Normalmente não.
--    Vou deixar fechado para update for now, exceto Admin.

CREATE POLICY "Enable update for admins"
  ON public.manifestacoes FOR UPDATE
  USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND user_type = 'ADMIN'
      )
  );
