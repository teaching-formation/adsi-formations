import { supabase, Session } from '@/lib/supabase'
import { submitEval } from './actions'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getSession(id: number): Promise<Session | null> {
  const { data } = await supabase.from('sessions').select('*').eq('id', id).single()
  return data as Session | null
}

export default async function EvalPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { error?: string }
}) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const session = await getSession(id)
  if (!session || session.statut !== 'done') notFound()

  const submitWithId = submitEval.bind(null, id)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      {/* Orbs décoratifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-lg z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl items-center justify-center text-2xl shadow-lg shadow-blue-500/25 mb-4">
            📝
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Évaluation de la session</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            {session.titre}
          </p>
          <p className="text-slate-600 text-xs mt-1">{session.mois} · {session.intervenant ?? 'Intervenant'}</p>
        </div>

        {/* Carte formulaire */}
        <div className="rounded-3xl border border-white/10 p-8 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}>

          {searchParams?.error && (
            <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-6 text-sm border"
              style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Une erreur est survenue. Veuillez réessayer.</span>
            </div>
          )}

          <form action={submitWithId} className="flex flex-col gap-7">

            {/* Q1 — Note globale */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
                1. Note globale <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3, 4, 5].map(n => (
                  <label key={n} className="cursor-pointer">
                    <input type="radio" name="note" value={n} required className="sr-only peer" />
                    <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-xl font-bold text-slate-400
                      peer-checked:border-blue-500 peer-checked:bg-blue-500/20 peer-checked:text-blue-300
                      hover:border-white/30 hover:text-slate-200 transition-all duration-150 select-none">
                      {['😞','😐','🙂','😊','🤩'][n - 1]}
                    </div>
                    <p className="text-center text-[10px] text-slate-600 mt-1">{n}/5</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2 — Point fort */}
            <div>
              <label htmlFor="point_fort" className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                2. Ce que vous avez le plus apprécié
              </label>
              <textarea
                id="point_fort"
                name="point_fort"
                rows={3}
                placeholder="Le contenu, la clarté, les exemples concrets…"
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Q3 — Suggestion */}
            <div>
              <label htmlFor="suggestion" className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                3. Une suggestion d&apos;amélioration
              </label>
              <textarea
                id="suggestion"
                name="suggestion"
                rows={3}
                placeholder="Plus d'exemples, durée, format, thématique…"
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <button type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all duration-200 mt-1"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              Envoyer mon évaluation →
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <a href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au programme
          </a>
        </div>
      </div>
    </div>
  )
}
