'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export async function createThemeAction(formData: FormData) {
  const titre = (formData.get('titre') as string).trim()
  if (!titre) redirect('/admin/evaluation?error=titre')

  await supabase.from('eval_configs').update({ actif: false }).neq('id', 0)

  const { error } = await supabase.from('eval_configs').insert({ titre, actif: true })
  if (error) redirect('/admin/evaluation?error=db')

  revalidatePath('/admin/evaluation')
  revalidatePath('/evaluation')
  redirect('/admin/evaluation')
}

export async function toggleThemeAction(id: number, actif: boolean) {
  if (actif) {
    // Désactiver tous puis activer celui-ci
    await supabase.from('eval_configs').update({ actif: false }).neq('id', 0)
    await supabase.from('eval_configs').update({ actif: true }).eq('id', id)
  } else {
    await supabase.from('eval_configs').update({ actif: false }).eq('id', id)
  }

  revalidatePath('/admin/evaluation')
  revalidatePath('/evaluation')
}

export async function deleteThemeAction(id: number) {
  await supabase.from('evaluations').delete().eq('config_id', id)
  await supabase.from('eval_configs').delete().eq('id', id)
  revalidatePath('/admin/evaluation')
}
