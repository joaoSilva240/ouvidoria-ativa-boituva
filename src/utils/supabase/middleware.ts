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

    // Rotas exclusivas para ADMIN (Transparência)
    if (path.startsWith("/transparencia") && !user) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return response
}
