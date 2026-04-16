# IDSI Formations 2026

Dashboard de suivi du programme de formations 2026 — Association des Anciens Diplômés IDSI (Côte d'Ivoire).

## Interfaces

| Route | Accès | Description |
|-------|-------|-------------|
| `/` | Public (sans login) | Dashboard membres — lecture seule |
| `/admin` | Protégé (mot de passe) | Panneau admin — édition en temps réel |

> La vue publique n'expose aucun lien vers `/admin`. L'admin dispose d'un bouton "Vue publique" pour basculer.

---

## Stack

- **Next.js 14** (App Router + Server Components + Server Actions)
- **Supabase** (PostgreSQL, RLS)
- **Tailwind CSS** (design system custom, pas de bibliothèque UI)
- **Docker** (build multi-stage, image Alpine)

---

## 1 — Prérequis Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Dans **SQL Editor**, exécuter le fichier `supabase/schema.sql`
3. Récupérer dans **Project Settings > API** :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2 — Variables d'environnement

Créer `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ADMIN_PASSWORD=votre_mot_de_passe
SESSION_SECRET=chaine_aleatoire_min_32_caracteres
```

---

## 3a — Développement local

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## 3b — Docker

### Lancer avec docker-compose

```bash
# Variables dans .env.local (lu automatiquement par docker-compose)
docker-compose up --build -d

# Logs
docker-compose logs -f app

# Arrêter
docker-compose down
```

### Build manuel

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... \
  -t idsi-formations .

docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=adsi2026 \
  -e SESSION_SECRET=une_longue_chaine_secrete \
  idsi-formations
```

---

## 4 — Déploiement Vercel

```bash
# 1. Push sur GitHub
# 2. Importer le repo sur vercel.com
# 3. Ajouter les 4 variables d'env dans Settings > Environment Variables
# 4. Deploy
```

---

## Structure du projet

```
/app
  page.tsx              ← dashboard public (server component, revalidate 60s)
  /admin
    page.tsx            ← login dark / dashboard admin dark
    actions.ts          ← server actions : login, logout, updateSession
/lib
  supabase.ts           ← client Supabase + type Session
  session.ts            ← cookie httpOnly 8h (natif Next.js, sans dépendance)
/components
  SessionCard.tsx       ← carte session vue publique
  AdminSessionCard.tsx  ← carte éditable (client component)
  StatsBar.tsx          ← 4 métriques colorées
  ProgressBar.tsx       ← barre de progression avec jalons
  PilierBadge.tsx       ← badges + couleurs par pilier
  FilterTabs.tsx        ← filtres Toutes / Réalisées / À venir
/supabase
  schema.sql            ← DDL + RLS + seed 20 sessions
Dockerfile              ← build multi-stage (deps → builder → runner Alpine)
docker-compose.yml      ← orchestration simple
```
