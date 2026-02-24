import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t border-border-color bg-bg-primary/90 px-6 py-6 transition-colors duration-300">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-xs font-medium text-text-secondary sm:flex-row">
                <span>© 2026 Boituva</span>

                <div className="flex items-center gap-6">
                    <Link href="/termos" className="transition-colors hover:text-primary">
                        Termos
                    </Link>
                </div>
            </div>
        </footer>
    );
}

