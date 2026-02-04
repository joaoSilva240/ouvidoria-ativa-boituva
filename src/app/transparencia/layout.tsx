import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function TransparenciaLayout({
    children
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient();

    // Verifica sessão
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    // Verifica Role ADMIN
    const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user.id)
        .single();

    if (!profile || profile.user_type !== "ADMIN") {
        // Redireciona usuários comuns para a consulta
        redirect("/consulta");
    }

    return (
        <>
            {children}
        </>
    );
}
