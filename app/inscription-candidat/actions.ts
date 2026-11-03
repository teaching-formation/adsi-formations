'use server'

import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'

export async function submitCandidat(formData: FormData) {
  const nom        = (formData.get('nom') as string ?? '').trim()
  const promotion  = (formData.get('promotion') as string ?? '').trim()
  const contact    = (formData.get('contact') as string ?? '').trim()
  const poste_vise = (formData.get('poste_vise') as string ?? '').trim()
  const groupe     = (formData.get('groupe') as string ?? '').trim()

  if (!nom || !contact || !groupe) {
    redirect('/inscription-candidat?error=1')
  }

  try {
    await sql`
      INSERT INTO jury_candidats (nom, promotion, contact, poste_vise, groupe)
      VALUES (${nom}, ${promotion || null}, ${contact}, ${poste_vise || null}, ${groupe})
    `
  } catch (e) {
    console.error('candidat insert error:', e)
    redirect('/inscription-candidat?error=2')
  }

  redirect('/inscription-merci?role=etudiant')
}
