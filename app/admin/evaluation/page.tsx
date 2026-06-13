import { getAdminSession } from '@/lib/session'
import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { createThemeAction, toggleThemeAction, deleteThemeAction } from './actions'

export const dynamic = 'force-dynamic'

type EvalConfig = {
  id: number
  titre: string
  actif: boolean
  created_at: string
}

type Evaluation = {
  id: number
  config_id: number
  note: number
  point_fort: string | null
  suggestion: string | null
  created_at: string
}

async function getData() {
  const [{ data: configs }, { data: evals }] = await Promise.all([
    supabase.from('eval_configs').select('*').order('created_at', { ascending: false }),
    supabase.from('evaluations').select('*').order('created_at', { ascending: false }),
  ])
  return {
    configs: (configs ?? []) as EvalConfig[],
    evals: (evals ?? []) as Evaluation[],
  }
}

export default async function AdminEvaluationPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const isAuthenticated = await getAdminSession()
  if (!isAuthenticated) redirect('/admin')

  const { configs, evals } = await getData()
  const activeConfig = configs.find(c => c.actif)

  const evalsForActive = activeConfig
    ? evals.filter(e => e.config_id === activeConfig.id)
    : []

  const avgNote = evalsForActive.length
    ? (evalsForActive.reduce((s, e) => s + e.note, 0) / evalsForActive.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>

      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b"
        style={{ background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-sm">
              📝
            </div>
            <p className="text-sm font-bold text-white">Évaluations · IDSI 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ← Admin
            </a>
            {activeConfig && (
              <a href="/evaluation" target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                Voir le formulaire public ↗
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* CRÉER UN THÈME */}
        <div className="rounded-2xl border p-6"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-sm font-bold text-white mb-1">Nouveau thème d&apos;évaluation</h2>
          <p className="text-xs mb-4" style={{ color: '#475569' }}>
            Le thème actif sera affiché sur la page publique. Un seul thème peut être actif à la fois.
          </p>
          {searchParams?.error && (
            <div className="mb-4 px-4 py-3 rounded-xl border text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              Erreur : {decodeURIComponent(searchParams.error)}
            </div>
          )}
          <form action={createThemeAction} className="flex gap-3">
            <input
              name="titre"
              required
              placeholder="Ex : Session Data Engineering — Juin 2026"
              className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <button type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white whitespace-nowrap transition-all"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
              Créer &amp; activer
            </button>
          </form>
        </div>

        {/* STATS THÈME ACTIF */}
        {activeConfig && (
          <div className="rounded-2xl border p-6"
            style={{ background: 'rgba(251,191,36,0.04)', borderColor: 'rgba(251,191,36,0.15)' }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#fbbf24' }}>Thème actif</span>
                </div>
                <h3 className="text-base font-extrabold text-white">{activeConfig.titre}</h3>
              </div>
              <span className="shrink-0 text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' }}>
                {evalsForActive.length} réponse{evalsForActive.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Réponses', value: evalsForActive.length, color: '#60a5fa' },
                { label: 'Note moyenne', value: avgNote ? `${avgNote}/5` : '—', color: '#fbbf24' },
                { label: 'Avec commentaire', value: evalsForActive.filter(e => e.point_fort).length, color: '#a78bfa' },
              ].map(k => (
                <div key={k.label} className="rounded-xl p-3 border"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-lg font-extrabold tabular-nums" style={{ color: k.color }}>{k.value}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>{k.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTE DES THÈMES */}
        {configs.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: '#475569' }}>
              Tous les thèmes
            </h2>
            {configs.map(cfg => {
              const count = evals.filter(e => e.config_id === cfg.id).length
              return (
                <div key={cfg.id} className="rounded-xl border px-4 py-3 flex items-center gap-3"
                  style={{ background: 'rgba(255,255,255,0.02)', borderColor: cfg.actif ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.06)' }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.actif ? 'bg-amber-400' : 'bg-slate-700'}`} />
                  <p className="flex-1 text-sm font-semibold text-white truncate">{cfg.titre}</p>
                  <span className="text-xs font-bold tabular-nums" style={{ color: '#475569' }}>{count} rép.</span>

                  <form action={toggleThemeAction.bind(null, cfg.id, !cfg.actif)}>
                    <button type="submit"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={cfg.actif
                        ? { color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }
                        : { color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
                      {cfg.actif ? 'Désactiver' : 'Activer'}
                    </button>
                  </form>

                  <form action={deleteThemeAction.bind(null, cfg.id)}>
                    <button type="submit"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      style={{ color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      Supprimer
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        )}

        {/* RÉPONSES DU THÈME ACTIF */}
        {evalsForActive.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: '#475569' }}>
              Réponses — {activeConfig?.titre}
            </h2>
            {evalsForActive.map(ev => (
              <div key={ev.id} className="rounded-xl border px-4 py-4 flex flex-col gap-2"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={`text-sm ${n <= ev.note ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
                    ))}
                  </div>
                  <span className="text-[11px]" style={{ color: '#334155' }}>
                    {new Date(ev.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {ev.point_fort && (
                  <p className="text-xs text-slate-300"><span style={{ color: '#64748b' }}>Point fort : </span>{ev.point_fort}</p>
                )}
                {ev.suggestion && (
                  <p className="text-xs text-slate-300"><span style={{ color: '#64748b' }}>Suggestion : </span>{ev.suggestion}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {configs.length === 0 && (
          <div className="rounded-2xl border p-12 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-2xl mb-3">📝</p>
            <p className="text-sm font-semibold text-white">Aucun thème créé</p>
            <p className="text-xs mt-1" style={{ color: '#475569' }}>Créez votre premier thème d&apos;évaluation ci-dessus.</p>
          </div>
        )}

      </main>
    </div>
  )
}
