'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sql } from '@/lib/db'

export async function createThemeAction(formData: FormData) {
  const titre = (formData.get('titre') as string).trim()
  if (!titre) redirect('/admin/evaluation?error=titre')

  try {
    await sql`UPDATE eval_configs SET actif = false`
    await sql`INSERT INTO eval_configs (titre, actif) VALUES (${titre}, true)`
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'db'
    console.error('createThemeAction error:', msg)
    redirect(`/admin/evaluation?error=${encodeURIComponent(msg)}`)
  }

  revalidatePath('/admin/evaluation')
  revalidatePath('/evaluation')
  redirect('/admin/evaluation')
}

export async function toggleThemeAction(id: number, actif: boolean) {
  if (actif) {
    // Désactiver tous puis activer celui-ci (un seul actif à la fois)
    await sql`UPDATE eval_configs SET actif = false`
    await sql`UPDATE eval_configs SET actif = true WHERE id = ${id}`
  } else {
    await sql`UPDATE eval_configs SET actif = false WHERE id = ${id}`
  }

  revalidatePath('/admin/evaluation')
  revalidatePath('/evaluation')
}

export async function deleteThemeAction(id: number) {
  // ON DELETE CASCADE supprime aussi les évaluations liées
  await sql`DELETE FROM eval_configs WHERE id = ${id}`
  revalidatePath('/admin/evaluation')
}
