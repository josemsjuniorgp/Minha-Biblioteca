// Tipos escritos à mão a partir de supabase/migrations/0001_init.sql.
// Assim que o projeto Supabase existir, regenerar com:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type AccessTier = "gratuito" | "prata" | "ouro";
export type ContentType = "curso" | "artigo" | "aula" | "material";
export type ContentStatus = "rascunho" | "em_aprovacao" | "publicado" | "reprovado";
export type AdminRole = "administrador_geral" | "administrador_total";
export type NewsCategory = "politica" | "mercado" | "tecnica" | "esporte" | "esporte_time";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          cidade: string | null;
          estado: string | null;
          cargo: string | null;
          area_atuacao: string | null;
          time_do_coracao: string | null;
          esporte_favorito: string | null;
          admin_role: AdminRole | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          nome: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          tier: AccessTier;
          status: "ativa" | "cancelada" | "expirada";
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          profile_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      content: {
        Row: {
          id: string;
          type: ContentType;
          title: string;
          summary: string | null;
          body: string | null;
          external_url: string | null;
          file_path: string | null;
          theme: string;
          tier: AccessTier;
          status: ContentStatus;
          issues_certificate: boolean;
          created_by: string;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["content"]["Row"]> & {
          type: ContentType;
          title: string;
          theme: string;
          created_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["content"]["Row"]>;
        Relationships: [];
      };
      news_sources: {
        Row: {
          id: string;
          name: string;
          category: NewsCategory;
          rss_url: string;
          team_slug: string | null;
          verified: boolean;
          active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["news_sources"]["Row"]> & {
          name: string;
          category: NewsCategory;
          rss_url: string;
        };
        Update: Partial<Database["public"]["Tables"]["news_sources"]["Row"]>;
        Relationships: [];
      };
      news_items: {
        Row: {
          id: string;
          source_id: string;
          title: string;
          link: string;
          published_at: string | null;
          fetched_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["news_items"]["Row"]> & {
          source_id: string;
          title: string;
          link: string;
        };
        Update: Partial<Database["public"]["Tables"]["news_items"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
