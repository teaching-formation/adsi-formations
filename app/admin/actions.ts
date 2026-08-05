'use server'

import { redirect } from 'next/navigation'
import { setAdminSession, clearAdminSession } from '@/lib/session'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const SESSION_FIELDS = [
  'titre', 'participants', 'statut', 'intervenant',
  'speaker_url', 'youtube_url', 'slides_url', 'mois', 'label', 'pilier',
] as const
type SessionField = (typeof SESSION_FIELDS)[number]

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string

  if (password !== process.env.ADMIN_PASSWORD) {
    redirect('/admin?error=1')
  }

  await setAdminSession()
  redirect('/admin')
}

export async function logoutAction() {
  await clearAdminSession()
  redirect('/admin')
}

export async function updateSessionAction(
  id: number,
  field: SessionField,
  value: string | number
) {
  // Whitelist du nom de colonne (interpolation sûre car validée)
  if (!SESSION_FIELDS.includes(field)) {
    throw new Error('Champ invalide')
  }

  try {
    await sql.query(`UPDATE sessions SET ${field} = $1 WHERE id = $2`, [value, id])
  } catch (e) {
    console.error('Update error:', e)
    throw new Error('Erreur lors de la mise à jour')
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteSessionAction(id: number) {
  let rows
  try {
    rows = await sql`DELETE FROM sessions WHERE id = ${id} RETURNING id`
  } catch (e) {
    console.error('Delete error:', e)
    throw new Error('Erreur lors de la suppression')
  }
  if (!rows || rows.length === 0) {
    throw new Error('Aucune session supprimée (id introuvable)')
  }
  revalidatePath('/')
  revalidatePath('/admin')
}
