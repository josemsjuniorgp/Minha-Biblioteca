-- Temas padronizados para cadastro de conteúdo (antes era texto livre).
-- Mantido em sincronia com src/lib/content-themes.ts.

create type content_theme as enum (
  'seguranca_trabalho',
  'gestao_projetos',
  'gestao_pessoas',
  'manutencao_industrial',
  'engenharia_civil',
  'engenharia_eletrica',
  'engenharia_mecanica',
  'engenharia_producao',
  'qualidade_processos',
  'meio_ambiente',
  'tecnologia_automacao',
  'carreira',
  'normas_legislacao',
  'institucional'
);

-- Conteúdo cadastrado antes desta migração usava texto livre; normaliza
-- para o valor mais próximo antes de trocar o tipo da coluna.
update content set theme = 'institucional' where theme not in (
  'seguranca_trabalho', 'gestao_projetos', 'gestao_pessoas', 'manutencao_industrial',
  'engenharia_civil', 'engenharia_eletrica', 'engenharia_mecanica', 'engenharia_producao',
  'qualidade_processos', 'meio_ambiente', 'tecnologia_automacao', 'carreira',
  'normas_legislacao', 'institucional'
);

alter table content
  alter column theme type content_theme using theme::content_theme;
