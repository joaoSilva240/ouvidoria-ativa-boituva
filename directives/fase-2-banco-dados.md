# Diretriz: Implementação da Camada de Dados (Fase 2)

## Objetivo
Implementar a infraestrutura de banco de dados para persistir as manifestações geradas pelo Wizard da Ouvidoria Digital, utilizando o ecossistema Supabase de forma segura, escalável e integrada ao Next.js App Router.

## Stack Tecnológica Definida
- **Banco de Dados**: PostgreSQL (via Supabase).
- **Autenticação**: Supabase Auth (Foco em **Autenticação Anônima**).
- **Storage**: Supabase Storage (para anexos).
- **ORM/Query Builder**: 3 Opções propostas abaixo (A, B ou C) para escolha do usuário.

---

## 1. Estratégia de Arquitetura

### 1.1 Autenticação e Segurança (Modelo Híbrido)
Considerando que o usuário pode ser "Anônimo" ou "Identificado" no formulário, mas não necessariamente possui uma conta "logada" no sistema:

- **Recomendação**: Utilizar **Supabase Anonymous Sign-ins**.
    - **Como funciona**: Ao entrar no Wizard, o sistema autentica o usuário silenciosamente como "Anônimo" (`supabase.auth.signInAnonymously()`).
    - **Vantagem**: O usuário ganha um `user_id` temporário no Supabase. Isso permite ativar o **RLS (Row Level Security)** para que ele possa inserir dados e, futuramente, consultar *apenas* suas próprias manifestações através desse token temporário (enquanto a sessão durar).
    - **Segurança**: Políticas RLS garantem que apenas o dono do token possa ver ou editar o rascunho/manifestação.

### 1.2 Schema do Banco de Dados (Proposta Inicial)

**Tabela: `manifestacoes`**
- `id` (UUID, Primary Key)
- `protocolo` (Texto, Unique - Gerado automaticamente, ex: `OUV-2024-XXXX`)
- `user_id` (UUID, FK -> `auth.users`) - Vincula ao usuário (anônimo ou logado).
- `tipo` (Enum/Texto: Elogio, Sugestão, etc.)
- `secretaria` (Texto)
- `endereco` (Texto)
- `relato` (Texto)
- `identificacao_dados` (JSONB) - Para salvar nome/contato caso o usuário se identifique no form, sem criar conta completa.
- `status` (Enum: `PENDENTE`, `EM_ANALISE`, `CONCLUIDO`)
- `created_at` (Timestamp)

**Tabela: `anexos`** (Opcional, ou usar array na tabela principal)
- `id` (UUID)
- `manifestacao_id` (UUID, FK)
- `caminho_storage` (Texto)
- `tipo_arquivo` (Texto)

---

## 2. Opções de Implementação (ORM/Client)

O usuário deve decidir qual abordagem prefere para conectar o Next.js ao Supabase. Apresentamos 3 opções baseadas nas suas preferências:

### Opção A: Supabase Client (Nativo) - **Recomendada para Simplicidade**
Uso direto da biblioteca `@supabase/ssr` e `@supabase/supabase-js`.
- **Pros**: Integração perfeita com Auth e Realtime. Menos código de configuração (boilerplate). RLS funciona nativamente.
- **Contras**: Type safety é boa, mas inferida do banco (requer rodar comando para gerar tipos). Não é um ORM completo.
- **Ideal para**: Projetos ágeis que usam pesadamente features exclusivas do Supabase.

### Opção B: Prisma + Supabase - **Foco em Tipagem**
Uso do Prisma ORM conectado ao Postgres do Supabase.
- **Pros**: Melhor Developer Experience (DX) de tipagem. Migrations automatizadas e robustas. Muito popular no mercado.
- **Contras**: Bundle size maior. Requer configurar *Connection Pooling* (Supavisor) para não estourar conexões em serverless. Não integra nativamente com Supabase Auth/RLS no nível da query (requer repassar headers).
- **Ideal para**: Quem prioriza estrutura rígida de banco e tipagem forte.

### Opção C: Drizzle ORM + Supabase - **Foco em Performance**
Uso do Drizzle ORM como query builder leve.
- **Pros**: Bundle size minúsculo (ótimo para Edge/Serverless). Sintaxe similar a SQL ("SQL-like"). Performance excelente. Tipagem forte.
- **Contras**: Curva de aprendizado levemente maior se acostumado com ORMs "mágicos" como Prisma.
- **Ideal para**: Performance, baixo overhead econtrole total das queries.

---

## 3. Plano de Ação (Próximos Passos)

1.  **Configuração de Ambiente**:
    -   Criar projeto no Supabase.
    -   Obter chaves (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
    -   Configurar variáveis no `.env.local`.

2.  **Definição da Stack**:
    -   **Decisão do Usuário**: Escolher entre Opção A, B ou C.

3.  **Implementação da Infra**:
    -   Configurar Cliente Supabase (e ORM escolhido).
    -   Criar Migrations/Tabelas.
    -   Configurar RLS Policies (Crucial!).

4.  **Integração com Wizard**:
    -   Alterar o passo "Finalizar" para disparar a Server Action de salvamento.
    -   Gerar protocolo.
    -   Upload de arquivos (se houver).
    -   Feedback de sucesso.

---

**Aguardando decisão do usuário para prosseguir com a Opção A, B ou C.**
