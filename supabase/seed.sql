-- Fontes de notícia validadas na Fase 03 do planejamento.
-- `verified = false` marca URLs de RSS que precisam ser conferidas
-- manualmente antes de ativar (portais menores trocam de endereço com
-- frequência) — o cron de notícias (src/app/api/cron/news) ignora
-- fontes com active = false.

insert into news_sources (name, category, rss_url, verified, active) values
  ('G1 — Política',        'politica', 'https://g1.globo.com/rss/g1/politica/',      true,  true),
  ('Agência Brasil — Geral','politica', 'https://agenciabrasil.ebc.com.br/rss.xml',   true,  true),
  ('G1 — Economia',        'mercado',  'https://g1.globo.com/rss/g1/economia/',      true,  true),
  ('InfoMoney',            'mercado',  'https://www.infomoney.com.br/feed/',         false, false),
  ('Exame',                'mercado',  'https://exame.com/feed/',                    false, false),
  ('AECweb',                'tecnica',  'https://www.aecweb.com.br/rss/noticias.xml', false, false),
  ('O Setor Elétrico',      'tecnica',  'https://www.osetoreletrico.com.br/feed/',    false, false),
  ('Engenharia360',         'tecnica',  'https://engenharia360.com/feed/',            false, false),
  ('IEEE Spectrum',         'tecnica',  'https://spectrum.ieee.org/feeds/feed.rss',   false, false),
  ('BBC News Mundo',       'politica', 'https://feeds.bbci.co.uk/mundo/rss.xml',     true,  true),
  ('The Guardian — World', 'politica', 'https://www.theguardian.com/world/rss',      true,  true)
on conflict do nothing;

-- Esporte geral e "time do coração" (ITEM-06 / RFI-06) dependem de um
-- feed por clube — cadastre um news_source por time à medida que os
-- usuários forem se registrando, com category = 'esporte_time' e
-- team_slug preenchido (ex.: 'flamengo').
