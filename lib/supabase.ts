import { createClient } from '@supabase/supabase-js'

// Fallback vide pour éviter le crash lors du next build dans Docker
// (les vraies valeurs sont injectées au runtime via les variables d'env)
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(
  supabaseUrl  || 'https://placeholder.supabase.co',
  supabaseKey  || 'placeholder-key'
)

export type Session = {
  id: number
  mois: string
  pilier: 'td' | 'data' | 'ia' | 'soft' | 'entrepreneuriat'
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
