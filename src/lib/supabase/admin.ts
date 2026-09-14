import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";
import type { Database } from "./types";

// Usa a service role key — ignora RLS. Só para código de servidor de
// confiança (cron de notícias), nunca importar de um Client Component.
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não definida. Preencha .env.local a partir de .env.example.",
    );
  }

  return createSupabaseClient<Database>(supabaseUrl(), serviceRoleKey, {
    auth: { persistSession: false },
  });
}
