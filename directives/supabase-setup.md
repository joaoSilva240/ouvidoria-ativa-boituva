# Diretiva: Configuração e Uso do Supabase (Next.js App Router)

Esta diretiva serve como guia de referência para a configuração e utilização do Supabase neste projeto, seguindo as melhores práticas para o Next.js App Router e o pacote `@supabase/ssr`.

## 1. Instalação

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto (não comite este arquivo!):

```env
NEXT_PUBLIC_SUPABASE_URL=seu_projeto_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 🚨 Troubleshooting Comum de CHAVES
1. **Formato da Chave**: A `NEXT_PUBLIC_SUPABASE_ANON_KEY` é um JWT. Ela **SEMPRE** começa com `ey`. Se a chave copiada for curta (ex: UUID) ou começar com `sb_`, está errada. Copie a chave completa no dashboard.
2. **Reinicie o Servidor**: Se você alterar o `.env.local`, você **TEM** que reiniciar o servidor (`npm run dev`) para que as mudanças surtam efeito. O Next.js não recarrega variáveis de ambiente "a quente".

## 3. Estrutura de Clientes Supabase

Devido à natureza do Next.js (Server vs Client Components), precisamos de utilitários distintos. Crie a pasta `src/utils/supabase`.

### 3.1. Cliente para Client Components (`src/utils/supabase/client.ts`)
Usado em componentes com `"use client"`, hooks e listeners de realtime.

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 3.2. Cliente para Server Components (`src/utils/supabase/server.ts`)
Usado em Server Components, Server Actions e Route Handlers. Precisa acessar cookies.

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar erro se chamado de um Server Component
          }
        },
      },
    }
  )
}
```

## 4. Middleware (`middleware.ts`)
Essencial para atualizar a sessão do Auth (refresh cookies) em cada requisição. Crie na raiz do projeto `src/middleware.ts` (ou `middleware.ts` na raiz se não usar src).

```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

E o arquivo auxiliar `src/utils/supabase/middleware.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
```

## 5. Exemplo de Uso (Autenticação Anônima)

Para iniciar uma sessão anônima assim que o app carrega (ex: no `layout.tsx` ou Provider):

### 🚨 Checklist Crítico para Autenticação Anônima
1. **Ativar no Dashboard**: Por padrão, o login anônimo vem **DESATIVADO**. Vá em `Supabase Dashboard > Authentication > Providers > Anonymous Sign-ins` e ative.
2. **Refresh Router**: O cookie setado no client não é visto imediatamente pelo Server Action. Após o login, force um `router.refresh()`.

```typescript
// Em um Client Component ou useEffect
import { useRouter } from "next/navigation";

const supabase = createClient()
const router = useRouter();

useEffect(() => {
    async function signIn() {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
            const { error } = await supabase.auth.signInAnonymously()
             if (!error) {
                // FORÇA O SERVIDOR A LER O NOVO COOKIE
                router.refresh(); 
            }
        }
    }
    signIn()
}, [router])
```

---
**Documentação Oficial**: [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
