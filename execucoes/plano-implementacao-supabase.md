# Plano de Execução Técnica: Integração Supabase (Opção A)

## Visão Geral
Implementação da persistência de dados utilizando o **Supabase Client Nativo (`@supabase/ssr`)** com autenticação anônima e RLS, conforme selecionado.

## Fases da Execução

### Fase 1: Configuração do Ambiente (Requer Ação do Usuário)
Antes de iniciarmos o código, precisamos que o projeto esteja criado no Supabase.
1. [ ] **Usuário criará projeto no Supabase**.
2. [ ] **Usuário fornecerá as credenciais**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. [ ] Atualização do arquivo `.env.local` com essas chaves.

### Fase 2: Instalação e Configuração dos Clientes
Instalação das dependências e criação dos utilitários de conexão para Next.js App Router.
- [ ] Instalar pacotes: `npm install @supabase/supabase-js @supabase/ssr`
- [ ] Criar Client Browser: `src/utils/supabase/client.ts`
- [ ] Criar Client Server: `src/utils/supabase/server.ts`
- [ ] Criar Middleware para gestão de sessão: `src/middleware.ts`

### Fase 3: Modelagem do Banco de Dados (SQL)
Criação das tabelas e políticas de segurança no dashboard do Supabase (via SQL Editor).
- [ ] Criar migration/script SQL para:
    - Tabela `manifestacoes`.
    - Tabela `anexos` (se aplicável agora ou futuro).
    - Habilitar RLS (`ALTER TABLE manifestacoes ENABLE ROW LEVEL SECURITY`).
    - Criar Policies:
        - `INSERT`: Permitir para `auth.role() = 'authenticated'` (inclui anônimos).
        - `SELECT`: Permitir apenas para o dono (`auth.uid() = user_id`).

### Fase 4: Integração no Frontend
Conectar o Wizard ao Supabase.
- [ ] **Autenticação Silenciosa**: No início do Wizard (pode ser no `ManifestacaoProvider` ou `layout`), executar `signInAnonymously()` se não houver usuário.
- [ ] **Ajuste na Server Action**: Criar uma Server Action `saveManifestacao` em `src/app/actions/manifestacao.ts` que:
    1. Cria o Cliente Supabase Server.
    2. Recebe os dados do formulário.
    3. Faz o INSERT no banco.
    4. Retorna sucesso/erro.
- [ ] **FinalizarPage**: Chamar essa Server Action ao clicar em "Enviar".

### Fase 5: Validação
- [ ] Teste de ponta a ponta: Preencher form -> Enviar -> Verificar registro no Dashboard do Supabase.

---
**Observação**: Aguardarei as chaves de API (Fase 1) após a aprovação deste plano.
