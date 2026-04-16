-- =============================================
-- IDSI Formations 2026 — Schéma Supabase
-- Exécuter dans : Supabase > SQL Editor
-- =============================================

-- DROP TABLE IF EXISTS sessions;

CREATE TABLE IF NOT EXISTS sessions (
  id            serial primary key,
  mois          text not null,
  pilier        text not null CHECK (pilier IN ('td', 'data', 'ia', 'soft', 'entrepreneuriat')),
  titre         text not null,
  label         text not null,
  statut        text not null default 'upcoming' CHECK (statut IN ('upcoming', 'next', 'done')),
  participants  int default 0,
  intervenant   text,
  speaker_url   text,          -- lien profil LinkedIn / site web du speaker
  youtube_url   text,          -- lien vidéo YouTube de la session
  slides_url    text,          -- lien support de présentation (PDF, Canva, Google Slides…)
  date_session  date
);

-- Si la table existe déjà, ajouter les nouvelles colonnes :
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS speaker_url  text;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS youtube_url  text;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS slides_url   text;

-- ── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique" ON sessions
  FOR SELECT USING (true);

CREATE POLICY "Mise à jour via anon" ON sessions
  FOR UPDATE USING (true);

-- ── SEED — 20 sessions ─────────────────────────────────────────────────────
INSERT INTO sessions (id, mois, pilier, titre, label, statut) VALUES
(1,  'Avril 2026',    'td',              'TD en entreprise : administration publique',    'TD — Acte 1 (1/2)',                  'done'),
(2,  'Avril 2026',    'td',              'Témoignages DSI agences africaines',            'TD — Acte 1 (2/2)',                  'next'),
(3,  'Mai 2026',      'soft',            'Leadership & influence dans la tech',            'Soft Skills — Leadership (1/2)',     'upcoming'),
(4,  'Mai 2026',      'soft',            'Cas pratiques : parcours alumni IDSI',          'Soft Skills — Leadership (2/2)',     'upcoming'),
(5,  'Juin 2026',     'data',            'Apache Kafka : pipelines temps réel',           'Data Engineering (1/2)',              'upcoming'),
(6,  'Juin 2026',     'data',            'Apache Iceberg & Lakehouse',                    'Data Engineering (2/2)',              'upcoming'),
(7,  'Juillet 2026',  'td',              'Impact des fintechs en Côte d''Ivoire',         'TD — Acte 2 (1/2)',                  'upcoming'),
(8,  'Juillet 2026',  'td',              'Mobile money & paiement digital',               'TD — Acte 2 (2/2)',                  'upcoming'),
(9,  'Août 2026',     'soft',            'Communication executive',                       'Soft Skills — Communication (1/2)', 'upcoming'),
(10, 'Août 2026',     'soft',            'Storytelling data & facilitation',              'Soft Skills — Communication (2/2)', 'upcoming'),
(11, 'Septembre 2026','ia',              'État de l''art IA 2026',                        'IA — LLMs & Agents (1/2)',           'upcoming'),
(12, 'Septembre 2026','ia',              'IA générative dans l''organisation',            'IA — LLMs & Agents (2/2)',           'upcoming'),
(13, 'Octobre 2026',  'entrepreneuriat', 'Monétiser ses compétences data/IA',             'Entrepreneuriat (1/2)',               'upcoming'),
(14, 'Octobre 2026',  'entrepreneuriat', 'Créer sa startup tech en CI',                  'Entrepreneuriat (2/2)',               'upcoming'),
(15, 'Novembre 2026', 'td',              'Cybersécurité & confiance numérique',           'TD — Acte 3 (1/2)',                  'upcoming'),
(16, 'Novembre 2026', 'td',              'Souveraineté numérique en Afrique',             'TD — Acte 3 (2/2)',                  'upcoming'),
(17, 'Décembre 2026', 'soft',            'Personal branding & gestion de carrière',       'Soft Skills — Carrière (1/2)',        'upcoming'),
(18, 'Décembre 2026', 'soft',            'Pitch & financement en Afrique',                'Soft Skills — Carrière (2/2)',        'upcoming'),
(19, 'Janvier 2027',  'td',              'Data & IA au cœur de la stratégie',            'TD — Acte 4 (1/2)',                  'upcoming'),
(20, 'Janvier 2027',  'td',              'IA & transformation digitale en Afrique',       'TD — Acte 4 (2/2)',                  'upcoming')
ON CONFLICT (id) DO NOTHING;
