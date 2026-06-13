import { supabase } from '@/lib/supabase'
import { submitEvaluationAction } from './actions'

export const dynamic = 'force-dynamic'

type EvalConfig = { id: number; titre: string; actif: boolean }

async function getActiveConfig(): Promise<EvalConfig | null> {
  const { data } = await supabase
    .from('eval_configs')
    .select('id, titre, actif')
    .eq('actif', true)
    .single()
  return data as EvalConfig | null
}

const EMOJIS = ['😞', '😐', '🙂', '😊', '🤩']

export default async function EvaluationPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const config = await getActiveConfig()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      {/* Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-lg z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl items-center justify-center text-2xl shadow-lg shadow-amber-500/25 mb-4">
            ⭐
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Évaluation</h1>
          <p className="text-slate-500 text-xs mt-1">IDSI Formations 2026</p>
        </div>

        {!config ? (
          /* Aucun thème actif */
          <div className="rounded-3xl border border-white/10 p-10 text-center backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <p className="text-4xl mb-4">🔒</p>
            <p className="text-white font-bold mb-2">Aucune évaluation en cours</p>
            <p className="text-slate-500 text-sm">L&apos;administrateur n&apos;a pas encore ouvert d&apos;évaluation.</p>
          </div>
        ) : (
          /* Formulaire */
          <div className="rounded-3xl border border-white/10 p-8 backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.05)' }}>

            {/* Thème */}
            <div className="mb-6 px-4 py-3 rounded-xl border"
              style={{ background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.2)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#fbbf24' }}>
                Session évaluée
              </p>
              <p className="text-sm font-bold text-white">{config.titre}</p>
            </div>

            {searchParams?.error && (
              <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-5 text-sm border"
                style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Une erreur est survenue, veuillez réessayer.</span>
              </div>
            )}

            <form action={submitEvaluationAction.bind(null, config.id)} className="flex flex-col gap-7">

              {/* Q1 — Note */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
                  1. Note globale <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  {[1, 2, 3, 4, 5].map(n => (
                    <label key={n} className="cursor-pointer">
                      <input type="radio" name="note" value={n} required className="sr-only peer" />
                      <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-xl
                        peer-checked:border-amber-400 peer-checked:bg-amber-400/20
                        hover:border-white/30 transition-all duration-150 select-none">
                        {EMOJIS[n - 1]}
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
                  id="point_fort" name="point_fort" rows={3}
                  placeholder="Le contenu, la clarté, les exemples concrets…"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Q3 — Suggestion */}
              <div>
                <label htmlFor="suggestion" className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                  3. Une suggestion d&apos;amélioration
                </label>
                <textarea
                  id="suggestion" name="suggestion" rows={3}
                  placeholder="Plus d'exemples, durée, format, thématique…"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <button type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }}>
                Envoyer mon évaluation →
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
