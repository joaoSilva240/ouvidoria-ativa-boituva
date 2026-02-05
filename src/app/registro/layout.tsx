import { Navbar } from "@/components/Navbar";
import { ManifestacaoProvider } from "@/contexts/ManifestacaoContext";

export default function WizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ManifestacaoProvider>
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
        </ManifestacaoProvider>
    );
}
