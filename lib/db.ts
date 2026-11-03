import { neon } from '@neondatabase/serverless'

// Client Postgres (Neon) — driver HTTP idéal pour le serverless (Vercel).
// Le driver passe par fetch(), que Vercel peut mettre en cache. Les pages qui
// doivent toujours lire frais appellent `noStore()` dans leur fonction de lecture
// (voir inscription-candidat, admin/*). Les pages en `revalidate` gardent le cache.
export const sql = neon(process.env.DATABASE_URL!)

export type Session = {
  id: number
  mois: string
  pilier: 'td' | 'data' | 'ia' | 'soft' | 'entrepreneuriat' | 'cyber'
  titre: string
  label: string
  statut: 'upcoming' | 'next' | 'done'
  participants: number
  intervenant: string | null
  speaker_url: string | null
  youtube_url: string | null
  slides_url: string | null     // support de présentation (PDF, Canva, Google Slides…)
  date_session: string | null
}
