import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { ManifestacaoProvider } from "@/contexts/ManifestacaoContext";

export default function WizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ManifestacaoProvider>
            <div className="min-h-screen bg-bg-secondary flex flex-col transition-colors duration-300">
                <Navbar />
                <main className="container mx-auto px-4 py-8 flex-1">
                    {children}
                </main>
                <SiteFooter />
            </div>
        </ManifestacaoProvider>
    );
}
