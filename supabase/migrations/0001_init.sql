-- Indústria 360 — esquema inicial
-- Modela os 3 níveis de acesso (gratuito/prata/ouro) desde o início,
-- mesmo que o MVP só ative cobrança para o nível gratuito (ver Fase 07
-- do planejamento). Ativar Prata/Ouro depois é extensão, não retrabalho.

create extension if not exists "pgcrypto";

create type access_tier as enum ('gratuito', 'prata', 'ouro');
create type content_type as enum ('curso', 'artigo', 'aula', 'material');
create type content_status as enum ('rascunho', 'em_aprovacao', 'publicado', 'reprovado');
create type admin_role as enum ('administrador_geral', 'administrador_total');
create type news_category as enum ('politica', 'mercado', 'tecnica', 'esporte', 'esporte_time');

-- ---------------------------------------------------------------------
-- Perfis (estende auth.users com os dados coletados no cadastro)
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  cidade text,
  estado text,
  cargo text,
  area_atuacao text,
  time_do_coracao text,
  esporte_favorito text,
  admin_role admin_role, -- null = usuário comum (não-admin)
  created_at timestamptz not null default now()
);

comment on column profiles.admin_role is
  'null = usuário comum. administrador_geral = gerencia conteúdo. administrador_total = acesso irrestrito.';

-- ---------------------------------------------------------------------
-- Assinaturas — um registro por usuário, controla o nível de acesso
-- ---------------------------------------------------------------------
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles (id) on delete cascade,
  tier access_tier not null default 'gratuito',
  status text not null default 'ativa' check (status in ('ativa', 'cancelada', 'expirada')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Conteúdo: cursos, artigos, aulas, materiais
-- ---------------------------------------------------------------------
create table content (
  id uuid primary key default gen_random_uuid(),
  type content_type not null,
  title text not null,
  summary text,
  body text,
  external_url text, -- ex.: link do vídeo no YouTube
  file_path text, -- caminho no Supabase Storage (PDF, podcast, .zip)
  theme text not null,
  tier access_tier not null default 'gratuito',
  status content_status not null default 'rascunho',
  issues_certificate boolean not null default false,
  created_by uuid not null references profiles (id),
  approved_by uuid references profiles (id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint approver_differs_from_author check (approved_by is null or approved_by <> created_by)
);

create index content_status_idx on content (status);
create index content_theme_idx on content (theme);
create index content_tier_idx on content (tier);

-- ---------------------------------------------------------------------
-- Notícias externas (agregadas via RSS, ver Fase 03)
-- ---------------------------------------------------------------------
create table news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category news_category not null,
  rss_url text not null,
  team_slug text, -- preenchido só para category = 'esporte_time'
  verified boolean not null default false, -- URL de RSS confirmada manualmente
  active boolean not null default true
);

create table news_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references news_sources (id) on delete cascade,
  title text not null,
  link text not null,
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  unique (source_id, link)
);

create index news_items_published_idx on news_items (published_at desc);

-- ---------------------------------------------------------------------
-- Gatilho: cria profile + assinatura gratuita ao nascer um auth.users
-- Os campos extras do cadastro (RFI-201) chegam via raw_user_meta_data.
-- ---------------------------------------------------------------------
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome, cidade, estado, cargo, area_atuacao, time_do_coracao, esporte_favorito)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', ''),
    new.raw_user_meta_data ->> 'cidade',
    new.raw_user_meta_data ->> 'estado',
    new.raw_user_meta_data ->> 'cargo',
    new.raw_user_meta_data ->> 'area_atuacao',
    new.raw_user_meta_data ->> 'time_do_coracao',
    new.raw_user_meta_data ->> 'esporte_favorito'
  );

  insert into public.subscriptions (profile_id, tier) values (new.id, 'gratuito');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------
-- Helpers de autorização usados pelas policies de RLS
-- ---------------------------------------------------------------------
create function is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and admin_role is not null
  );
$$;

create function is_admin_total()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and admin_role = 'administrador_total'
  );
$$;

create function my_tier()
returns access_tier
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (select tier from public.subscriptions where profile_id = auth.uid() and status = 'ativa'),
    'gratuito'
  );
$$;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table content enable row level security;
alter table news_sources enable row level security;
alter table news_items enable row level security;

create policy "usuário vê o próprio perfil" on profiles
  for select using (id = auth.uid() or is_admin());

create policy "usuário edita o próprio perfil" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "usuário vê a própria assinatura" on subscriptions
  for select using (profile_id = auth.uid() or is_admin());

-- Conteúdo publicado é visível para quem tem o nível de acesso exigido.
-- 'gratuito' < 'prata' < 'ouro' — cada nível também vê os anteriores.
create policy "conteúdo publicado por nível de acesso" on content
  for select using (
    status = 'publicado'
    and (
      tier = 'gratuito'
      or (tier = 'prata' and my_tier() in ('prata', 'ouro'))
      or (tier = 'ouro' and my_tier() = 'ouro')
    )
  );

create policy "admin vê todo o conteúdo" on content
  for select using (is_admin());

create policy "admin cadastra conteúdo" on content
  for insert with check (is_admin() and created_by = auth.uid());

-- Qualquer administrador (geral ou total) gerencia conteúdo, inclusive
-- aprovando o de outro admin — é o fluxo de aprovação da Fase 01
-- (ITEM-105). O constraint approver_differs_from_author acima garante
-- que ninguém aprova o próprio cadastro.
create policy "admin gerencia conteúdo" on content
  for update using (is_admin()) with check (is_admin());

create policy "fontes de notícia são públicas para leitura" on news_sources
  for select using (true);

create policy "admin total gerencia fontes de notícia" on news_sources
  for all using (is_admin_total()) with check (is_admin_total());

create policy "notícias agregadas são públicas para leitura" on news_items
  for select using (true);
