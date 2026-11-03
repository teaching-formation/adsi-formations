'use server'

import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'

export async function submitJuryVolontaire(formData: FormData) {
  const nom            = (formData.get('nom') as string ?? '').trim()
  const poste          = (formData.get('poste') as string ?? '').trim()
  const contact        = (formData.get('contact') as string ?? '').trim()
  const linkedin       = (formData.get('linkedin') as string ?? '').trim()
  const domaine        = (formData.get('domaine') as string ?? '').trim()
  const groupes        = formData.getAll('groupes').map(String).join(', ')
  const disponibilites = (formData.get('disponibilites') as string ?? '').trim()

  if (!nom || !poste || !contact) {
    redirect('/inscription-jury?error=1')
  }

  try {
    await sql`
      INSERT INTO jury_volontaires (nom, poste, contact, linkedin, domaine, groupes, disponibilites)
      VALUES (${nom}, ${poste}, ${contact}, ${linkedin || null}, ${domaine || null}, ${groupes || null}, ${disponibilites || null})
    `
  } catch (e) {
    console.error('jury volontaire insert error:', e)
    redirect('/inscription-jury?error=2')
  }

  redirect('/inscription-merci?role=aine')
}
