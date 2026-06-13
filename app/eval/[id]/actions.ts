'use server'

import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export async function submitEval(sessionId: number, formData: FormData) {
  const note      = parseInt(formData.get('note') as string)
  const point_fort  = (formData.get('point_fort') as string).trim()
  const suggestion  = (formData.get('suggestion') as string).trim()

  if (!note || note < 1 || note > 5) {
    redirect(`/eval/${sessionId}?error=1`)
  }

  const { error } = await supabase.from('evaluations').insert({
    session_id: sessionId,
    note,
    point_fort: point_fort || null,
    suggestion: suggestion || null,
  })

  if (error) {
    console.error('Eval insert error:', error)
    redirect(`/eval/${sessionId}?error=2`)
  }

  redirect(`/eval/${sessionId}/merci`)
}
