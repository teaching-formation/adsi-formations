import { neon } from '@neondatabase/serverless'

// Client Postgres (Neon) — driver HTTP idéal pour le serverless (Vercel).
// `cache: 'no-store'` : le driver passe par fetch(), que Vercel met sinon en
// cache (Data Cache persistant même entre déploiements) → lectures toujours fraîches.
export const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: { cache: 'no-store' },
})

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
