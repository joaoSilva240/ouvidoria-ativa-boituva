'use client'

import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Com SSR, definir staleTime > 0 evita refetch imediato no cliente
                staleTime: 60 * 1000, // 1 minuto
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (isServer) {
        // Server: sempre criar novo query client
        return makeQueryClient()
    } else {
        // Browser: criar apenas se não existir (evita recriação em suspense)
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
