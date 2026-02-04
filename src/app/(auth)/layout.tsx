import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Lado Esquerdo - Formulário */}
            <div className="w-full lg:w-[45%] flex flex-col p-8 lg:p-16 overflow-y-auto">
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-8"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Voltar para o início
                    </Link>

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
            <div className="hidden lg:flex w-[55%] bg-slate-900 relative overflow-hidden">
                {/* Imagem de Fundo (Simulada com a imagem-home.jpg ou placeholder) */}
                <div className="absolute inset-0">
                    <Image
                        src="/imagem-home.jpg"
                        alt="Boituva"
                        fill
                        className="object-cover opacity-60 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-primary/30 mix-blend-multiply" />
                </div>

                <div className="relative z-10 m-auto max-w-2xl px-12 text-center text-white">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-sm font-medium mb-6">
                        Ouvidoria Digital Municipal
                    </div>

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Construindo progresso <br />
                        <span className="text-primary-400">de mãos dadas.</span>
                    </h1>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-left flex gap-4 mt-8">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Transparência e Agilidade</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Acompanhe suas solicitações em tempo real e ajude a prefeitura a cuidar melhor da nossa cidade.
                            </p>
                        </div>
                    </div>

                    {/* Carousel Dots simulados */}
                    <div className="flex justify-center gap-2 mt-12">
                        <div className="w-8 h-1.5 bg-primary rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
