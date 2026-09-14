"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string | null };

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const proximo = String(formData.get("proximo") ?? "/inicio");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha inválidos." };
  }

  redirect(proximo || "/inicio");
}

export async function signup(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nome = String(formData.get("nome") ?? "");

  if (password.length < 8) {
    return { error: "A senha precisa ter pelo menos 8 caracteres." };
  }
  if (!nome.trim()) {
    return { error: "Informe seu nome." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome,
        cidade: String(formData.get("cidade") ?? "") || null,
        estado: String(formData.get("estado") ?? "") || null,
        cargo: String(formData.get("cargo") ?? "") || null,
        area_atuacao: String(formData.get("area_atuacao") ?? "") || null,
        time_do_coracao: String(formData.get("time_do_coracao") ?? "") || null,
        esporte_favorito: String(formData.get("esporte_favorito") ?? "") || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/inicio");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
