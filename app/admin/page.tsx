import { getAdminSession } from '@/lib/session'
import { supabase, Session } from '@/lib/supabase'
import { loginAction, logoutAction } from './actions'
import { AdminSessionCard } from '@/components/AdminSessionCard'

export const dynamic = 'force-dynamic'

async function getSessions(): Promise<Session[]> {
  const { data, error } = await supabase.from('sessions').select('*').order('id', { ascending: true })
  if (error) return []
  return data as Session[]
}

export default async function AdminPage({ searchParams }: { searchParams: { error?: string } }) {
  const isAuthenticated = await getAdminSession()

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '1s' }} />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative w-full max-w-sm z-10">
          {/* Card */}
          <div className="rounded-3xl border border-white/10 p-8 backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.05)' }}>

            {/* Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl items-center justify-center text-2xl shadow-lg shadow-blue-500/25 mb-4">
                🎓
              </div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">Espace Admin</h1>
              <p className="text-slate-400 text-sm mt-1">IDSI Formations 2026</p>
            </div>

            <form action={loginAction} className="flex flex-col gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Mot de passe administrateur
                </label>
                <input
                  id="password" name="password" type="password"
                  required autoFocus placeholder="••••••••••••"
                  className="w-full px-4 py-3.5 rounded-xl text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {searchParams?.error === '1' && (
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm border"
                  style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Mot de passe incorrect</span>
                </div>
              )}

              <button type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all duration-200 mt-1"
                style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                Connexion →
              </button>
            </form>
          </div>

          <div className="mt-5 text-center">
            <a href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au dashboard public
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  const sessions = await getSessions()
  const done = sessions.filter(s => s.statut === 'done')
  const next = sessions.find(s => s.statut === 'next')
  const totalParticipants = done.reduce((sum, s) => sum + (s.participants ?? 0), 0)
  const pct = sessions.length > 0 ? Math.round((done.length / sessions.length) * 100) : 0

  const grouped = sessions.reduce<Record<string, Session[]>>((acc, s) => {
    if (!acc[s.mois]) acc[s.mois] = []
    acc[s.mois].push(s)
    return acc
  }, {})

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b"
        style={{ background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between min-w-0">
          {/* Left: brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-sm shadow-sm">
              ⚙️
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">Admin · IDSI 2026</p>
            </div>
            <div className="sm:hidden">
              <p className="text-sm font-bold text-white">Admin</p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <a href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">Vue publique</span>
            </a>
            <form action={logoutAction}>
              <button type="submit"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* ── KPI STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Sessions réalisées', value: `${done.length}/${sessions.length}`, color: '#34d399', icon: '✅' },
            { label: 'Participants total',  value: totalParticipants || '—',            color: '#60a5fa', icon: '👥' },
            { label: 'Progression',        value: `${pct}%`,                           color: '#a78bfa', icon: '📈' },
            { label: 'Prochaine',          value: next ? next.mois.split(' ')[0] : '—', color: '#fbbf24', icon: '📅' },
          ].map(k => (
            <div key={k.label} className="rounded-xl p-4 border"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-lg mb-2">{k.icon}</p>
              <p className="text-xl font-extrabold tabular-nums" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: '#475569' }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* ── AUTOSAVE NOTICE ── */}
        <div className="flex items-center gap-3 rounded-xl px-4 py-3 border"
          style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.15)' }}>
          <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: '#93c5fd' }}>
            <strong style={{ color: '#bfdbfe' }}>Sauvegarde automatique</strong> — chaque modification est enregistrée immédiatement dans Supabase.
          </p>
        </div>

        {/* ── SESSION LIST ── */}
        {Object.entries(grouped).map(([mois, group]) => (
          <section key={mois} className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: '#475569' }}>
                  {mois}
                </span>
              </div>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ color: '#475569', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {group.length} session{group.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.map(session => (
                <AdminSessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="py-6 px-4 mt-4 border-t text-center"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <p className="text-xs" style={{ color: '#1e293b' }}>Interface Admin · IDSI Formations 2026</p>
      </footer>
    </div>
  )
}
