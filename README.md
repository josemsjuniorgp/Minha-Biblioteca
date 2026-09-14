# Indústria 360

Portal de conteúdo e comunidade para profissionais de engenharia e
indústria — estudantes, engenheiros, gerentes, coordenadores, diretores,
mantenedores e administradores. Login personalizado, cursos/artigos/aulas/
materiais em três níveis de acesso (Gratuito, Prata, Ouro) e notícias
agregadas de portais externos.

O escopo completo do produto foi decidido fase a fase antes da primeira
linha de código; este repositório implementa a **Fase 07 (MVP)**: só o
nível Gratuito ativo, com o modelo de dados já preparado para Prata/Ouro.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS v4
- [Supabase](https://supabase.com) — Postgres, Auth e Storage
- Deploy: Vercel (Hobby para começar, ver `vercel.json` para o cron de notícias)

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Supabase](https://supabase.com) e aplique o schema:

   ```bash
   npx supabase login
   npx supabase link --project-ref <seu-project-ref>
   npx supabase db push
   ```

   Isso roda `supabase/migrations/0001_init.sql` (tabelas, RLS, gatilho de
   cadastro) e opcionalmente `supabase/seed.sql` (fontes de notícia).

3. Copie `.env.example` para `.env.local` e preencha com as chaves do
   projeto (Project Settings → API no painel do Supabase):

   ```bash
   cp .env.example .env.local
   ```

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

```
src/app/                 páginas (App Router)
  ├─ page.tsx             landing pública
  ├─ login/, cadastro/    autenticação
  ├─ inicio/              home personalizada (protegida)
  ├─ admin/                painel administrativo (protegido, admin only)
  └─ api/cron/news/       job diário de agregação de notícias (RSS)
src/lib/supabase/         clientes Supabase (browser, server, admin) e tipos
src/lib/actions/          Server Actions (auth, conteúdo)
src/components/           componentes compartilhados
src/proxy.ts              protege /inicio e /admin, redireciona sem sessão
supabase/migrations/      schema SQL (tabelas, enums, RLS, triggers)
supabase/seed.sql         fontes de notícia validadas na Fase 03
```

## Notícias externas

`src/app/api/cron/news/route.ts` busca o RSS de cada fonte ativa em
`news_sources` e grava os itens novos em `news_items`. Está agendado para
rodar diariamente via Vercel Cron (`vercel.json`). Algumas fontes em
`supabase/seed.sql` estão com `active = false` porque a URL do RSS ainda
não foi confirmada manualmente — verifique antes de ativar.

Para rodar localmente fora do cron, chame `GET /api/cron/news` (defina
`CRON_SECRET` em `.env.local` e mande o header
`Authorization: Bearer <CRON_SECRET>`, ou deixe a variável vazia em dev).

## Papéis de administrador

- **Administrador Total** — acesso irrestrito a todo o sistema.
- **Administrador Geral** — gerenciamento de conteúdo (cadastro, edição,
  aprovação). Um conteúdo só fica público depois de aprovado por um
  administrador diferente de quem o cadastrou.

Não existe cadastro de admin pela interface ainda — promova um usuário
direto no banco:

```sql
update profiles set admin_role = 'administrador_total' where id = '<user-id>';
```
