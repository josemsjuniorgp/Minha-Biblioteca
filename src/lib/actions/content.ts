"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  AccessTier,
  ContentType,
} from "@/lib/supabase/types";
import type { ContentTheme } from "@/lib/content-themes";

export type ContentFormState = { error: string | null };

export async function createContent(
  _prevState: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const theme = String(formData.get("theme") ?? "").trim() as ContentTheme;
  const type = String(formData.get("type") ?? "") as ContentType;
  const tier = String(formData.get("tier") ?? "gratuito") as AccessTier;

  if (!title || !theme) {
    return { error: "Título e tema são obrigatórios." };
  }

  const { error } = await supabase.from("content").insert({
    title,
    theme,
    type,
    tier,
    summary: String(formData.get("summary") ?? "") || null,
    body: String(formData.get("body") ?? "") || null,
    external_url: String(formData.get("external_url") ?? "") || null,
    issues_certificate: formData.get("issues_certificate") === "on",
    status: "em_aprovacao",
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function approveContent(contentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("content")
    .update({
      status: "publicado",
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    })
    .eq("id", contentId);

  revalidatePath("/admin");
}

export async function rejectContent(contentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("content").update({ status: "reprovado" }).eq("id", contentId);

  revalidatePath("/admin");
}
