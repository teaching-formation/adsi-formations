'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

export async function submitEvaluationAction(configId: number, formData: FormData) {
  const note = parseInt(formData.get('note') as string)
  const point_fort = (formData.get('point_fort') as string ?? '').trim()
  const suggestion = (formData.get('suggestion') as string ?? '').trim()

  if (!note || note < 1 || note > 5) {
    redirect('/evaluation?error=1')
  }

  const { error } = await supabase.from('evaluations').insert({
    config_id: configId,
    note,
    point_fort: point_fort || null,
    suggestion: suggestion || null,
  })

  if (error) {
    console.error('Evaluation insert error:', error)
    redirect('/evaluation?error=2')
  }

  // Marquer comme voté pour ce thème (cookie 30 jours)
  cookies().set(`voted_${configId}`, '1', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  redirect('/evaluation/merci')
}
