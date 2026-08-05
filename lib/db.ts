import { neon } from '@neondatabase/serverless'

// Client Postgres (Neon) — driver HTTP idéal pour le serverless (Vercel)
// La connexion se réveille automatiquement, le DNS reste toujours actif.
export const sql = neon(process.env.DATABASE_URL!)

export type Session = {
  id: number
  mois: string
  pilier: 'td' | 'data' | 'ia' | 'soft' | 'entrepreneuriat' | 'cyber' | 'transfo'
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
