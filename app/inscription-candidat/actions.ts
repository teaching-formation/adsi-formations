'use server'

import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'
import { unstable_noStore as noStore } from 'next/cache'

export async function submitCandidat(formData: FormData) {
  const nom        = (formData.get('nom') as string ?? '').trim()
  const promotion  = (formData.get('promotion') as string ?? '').trim()
  const contact    = (formData.get('contact') as string ?? '').trim()
  const poste_vise = (formData.get('poste_vise') as string ?? '').trim()
  const groupe     = (formData.get('groupe') as string ?? '').trim()

  if (!nom || !contact || !groupe) {
    redirect('/inscription-candidat?error=1')
  }

  // Garde-fou : refuser si le groupe a déjà 4 étudiants (lecture isolée du redirect)
  let count = 0
  try {
    noStore()
    const rows = await sql`SELECT count(*)::int n FROM jury_candidats WHERE groupe = ${groupe}`
    count = (rows[0] as { n: number }).n
  } catch (e) {
    console.error('candidat count error:', e)
    redirect('/inscription-candidat?error=2')
  }
  if (count >= 4) {
    redirect('/inscription-candidat?error=full')
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
