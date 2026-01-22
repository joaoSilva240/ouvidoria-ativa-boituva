import { WizardHeader } from "@/components/wizard/WizardHeader";

export default function WizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <WizardHeader />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
