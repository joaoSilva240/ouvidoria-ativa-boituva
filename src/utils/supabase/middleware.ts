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

    // IMPORTANT: You *must* run the getUser method to update the user session
    // for your middleware instructions to work correctly.
    const { data: { user } } = await supabase.auth.getUser()

    // Proteção de rotas
    const path = request.nextUrl.pathname;

    // Rotas públicas (não requerem autenticação)
    const isPublicRoute = path.startsWith("/login") || path.startsWith("/cadastro");

    // Proteger Home Page - Apenas usuários logados
    if (path === "/" && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Proteger rotas de registro de manifestação
    if (path.startsWith("/registro") && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Proteger consulta
    if (path.startsWith("/consulta") && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verificações de permissão baseadas no tipo de usuário
    if (user) {
        const userType = user.user_metadata?.user_type || 'COMUM';
        const isOuvidor = userType === 'ADMIN' || userType === 'OUVIDOR';

        // 1. Ouvidor NÃO acessa área de consulta pública nem abertura de manifestação
        if (isOuvidor && (path.startsWith("/consulta") || path.startsWith("/registro") || path === "/")) {
            // Se tentar acessar home ou consulta, vai para painel
            return NextResponse.redirect(new URL("/transparencia", request.url));
        }

        // 2. Comum NÃO acessa área de transparência (gestão)
        // Nota: A área 'transparencia' pública (dashboards) pode ser acessível, mas a gestão (/manifestacoes) não.
        // Assumindo que /transparencia é o painel administrativo conforme contexto anterior.
        // Se houver uma área pública de transparência, precisaria diferenciar rotas.
        // Dado o contexto "Ações do servidor" em [protocolo], /transparencia parece ser a área restrita.
        if (!isOuvidor && path.startsWith("/transparencia")) {
            // Redireciona para consulta ou home
            return NextResponse.redirect(new URL("/consulta", request.url));
        }
    } else {
        // Usuário não logado
        // Bloquear rotas protegidas
        if (path.startsWith("/transparencia")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        // Consulta pública pode ser acessada sem login? Pelo contexto, sim (via protocolo), mas o middleware atual bloqueava.
        // "Acesse a pagina de consultas isso é exclusivo do usuário comum."
        // Se o usuário comum acessa sem logar (com protocolo), então não deve bloquear.
        // Mas se requer login para ver histórico completo, deve bloquear.
        // O código atual bloqueava `/consulta` sem user. Vou manter a proteção se for a regra atual.
        // O usuário disse "usuário comum", não "anônimo".
    }

    return response
}
