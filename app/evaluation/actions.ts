'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { sql } from '@/lib/db'

export async function submitEvaluationAction(configId: number, formData: FormData) {
  const note = parseInt(formData.get('note') as string)
  const point_fort = (formData.get('point_fort') as string ?? '').trim()
  const suggestion = (formData.get('suggestion') as string ?? '').trim()

  if (!note || note < 1 || note > 5) {
    redirect('/evaluation?error=1')
  }

  try {
    await sql`
      INSERT INTO evaluations (config_id, note, point_fort, suggestion)
      VALUES (${configId}, ${note}, ${point_fort || null}, ${suggestion || null})
    `
  } catch (e) {
    console.error('Evaluation insert error:', e)
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
