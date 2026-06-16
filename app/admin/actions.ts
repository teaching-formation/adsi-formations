'use server'

import { redirect } from 'next/navigation'
import { setAdminSession, clearAdminSession } from '@/lib/session'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

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
  field: 'titre' | 'participants' | 'statut' | 'intervenant' | 'speaker_url' | 'youtube_url' | 'slides_url' | 'mois' | 'label' | 'pilier',
  value: string | number
) {
  const { error } = await supabase
    .from('sessions')
    .update({ [field]: value })
    .eq('id', id)

  if (error) {
    console.error('Update error:', error)
    throw new Error('Erreur lors de la mise à jour')
  }

  revalidatePath('/')
  revalidatePath('/admin')
}

export async function deleteSessionAction(id: number) {
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) {
    console.error('Delete error:', error)
    throw new Error('Erreur lors de la suppression')
  }
  revalidatePath('/')
  revalidatePath('/admin')
}
