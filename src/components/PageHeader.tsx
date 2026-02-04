import Image from "next/image";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
}

/**
 * Reusable institutional header with Boituva logo.
 * Used across transparency and other public pages.
 */
export function PageHeader({ title, subtitle = "OUVIDORIA DIGITAL" }: PageHeaderProps) {
    return (
        <header className="flex flex-col items-center gap-4 mb-8">
            <div className="flex flex-col items-center">
                <Image
                    src="/logo-boituva.png"
                    alt="Boituva"
                    width={400}
                    height={120}
                    priority
                    className="h-20 w-auto mb-2"
                />
                <p className="text-grafite/50 text-xs font-semibold tracking-[0.3em]">
                    {subtitle}
                </p>
            </div>
            {title && (
                <h1 className="text-4xl font-extrabold text-grafite text-center">
                    {title}
                </h1>
            )}
        </header>
    );
}
