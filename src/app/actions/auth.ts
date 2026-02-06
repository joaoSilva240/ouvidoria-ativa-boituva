"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // Check user role
    const { data: { user } } = await supabase.auth.getUser();

    // Buscar profile para saber se é admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", user?.id)
        .single();

    // Sincronizar metadata com profile para garantir que o middleware funcione corretamente
    // O middleware lê do metadata para evitar queries no banco a cada request.
    if (profile && user && user.user_metadata?.user_type !== profile.user_type) {
        await supabase.auth.updateUser({
            data: { user_type: profile.user_type }
        });
    }

    if (profile?.user_type === "ADMIN" || profile?.user_type === "OUVIDOR") {
        redirect("/transparencia");
    } else {
        redirect("/"); // Redireciona para Home
    }
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const nome = formData.get("nome") as string;
    const cpf = formData.get("cpf") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;
    const password = formData.get("password") as string;
    const senhaConfirmacao = formData.get("confirmPassword") as string; // Caso tenha no form

    /* 
       TODO: Validação Backend de CPF e Senha
    */

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nome,
                cpf,
                telefone,
                user_type: "COMUM", // Default
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (data.session) {
        redirect("/"); // Redireciona para Home
    } else {
        // Email confirmation required?
        return { success: true, message: "Verifique seu email para confirmar o cadastro." };
    }
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}

export async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return { ...user, profile };
}
