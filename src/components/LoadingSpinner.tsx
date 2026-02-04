/**
 * Full-screen loading spinner component.
 * Displays a centered spinner with an optional message.
 */

interface LoadingSpinnerProps {
    message?: string;
}

export function LoadingSpinner({ message = "Carregando..." }: LoadingSpinnerProps) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-slate-100 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary" />
                <p className="mt-4 text-grafite font-semibold text-lg">{message}</p>
            </div>
        </div>
    );
}
