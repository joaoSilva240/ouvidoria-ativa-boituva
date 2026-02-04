import Image from "next/image";
import Link from "next/link";
import { HeroPanel } from "@/components/HeroPanel";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Lado Esquerdo - Formulário */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 overflow-y-auto">
                <div className="mb-12">
                    <div className="w-40 mb-6">
                        <Image
                            src="/logo-boituva.png"
                            alt="Prefeitura de Boituva"
                            width={160}
                            height={48}
                            className="w-full h-auto"
                        />
                    </div>
                </div>

                <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
                    {children}
                </main>

                <footer className="mt-12 flex justify-between text-xs text-slate-400">
                    <span>© 2026 Boituva</span>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-primary">Privacidade</Link>
                        <Link href="#" className="hover:text-primary">Termos</Link>
                    </div>
                </footer>
            </div>

            {/* Lado Direito - Imagem/Institucional */}
            <HeroPanel />
        </div>
    );
}
