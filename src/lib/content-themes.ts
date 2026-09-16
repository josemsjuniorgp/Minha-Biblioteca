// Mantido em sincronia com o enum content_theme (supabase/migrations/0002_content_themes.sql).
export const CONTENT_THEMES = [
  { value: "seguranca_trabalho", label: "Segurança do Trabalho" },
  { value: "gestao_projetos", label: "Gestão de Projetos" },
  { value: "gestao_pessoas", label: "Gestão de Pessoas e Liderança" },
  { value: "manutencao_industrial", label: "Manutenção Industrial" },
  { value: "engenharia_civil", label: "Engenharia Civil" },
  { value: "engenharia_eletrica", label: "Engenharia Elétrica" },
  { value: "engenharia_mecanica", label: "Engenharia Mecânica" },
  { value: "engenharia_producao", label: "Engenharia de Produção" },
  { value: "qualidade_processos", label: "Qualidade e Processos" },
  { value: "meio_ambiente", label: "Meio Ambiente e Sustentabilidade" },
  { value: "tecnologia_automacao", label: "Tecnologia e Automação" },
  { value: "carreira", label: "Carreira e Desenvolvimento Profissional" },
  { value: "normas_legislacao", label: "Legislação e Normas Técnicas" },
  { value: "institucional", label: "Institucional" },
] as const;

export type ContentTheme = (typeof CONTENT_THEMES)[number]["value"];

const THEME_LABEL = new Map(CONTENT_THEMES.map((t) => [t.value, t.label]));

export function contentThemeLabel(theme: string): string {
  return THEME_LABEL.get(theme as ContentTheme) ?? theme;
}
