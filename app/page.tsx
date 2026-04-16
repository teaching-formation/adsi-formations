import { supabase, Session } from '@/lib/supabase'
import { StatsGrid } from '@/components/StatsGrid'
import { ProgramProgress } from '@/components/ProgramProgress'
import { SessionCard } from '@/components/SessionCard'
import { FilterTabs } from '@/components/FilterTabs'

export const revalidate = 60

async function getSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('id', { ascending: true })
  if (error) { console.error(error); return [] }
  return data as Session[]
}

export default async function HomePage({ searchParams }: { searchParams: { filtre?: string } }) {
  const sessions = await getSessions()
  const filtre = searchParams?.filtre ?? 'toutes'

  const filtered =
    filtre === 'realisees' ? sessions.filter(s => s.statut === 'done') :
    filtre === 'avenir'    ? sessions.filter(s => s.statut !== 'done') :
    sessions

  const grouped = filtered.reduce<Record<string, Session[]>>((acc, s) => {
    if (!acc[s.mois]) acc[s.mois] = []
    acc[s.mois].push(s)
    return acc
  }, {})

  const done     = sessions.filter(s => s.statut === 'done')
  const upcoming = sessions.filter(s => s.statut !== 'done')
  const counts   = { toutes: sessions.length, realisees: done.length, avenir: upcoming.length }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <div className="mesh-bg relative overflow-hidden">

        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Floating orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-28">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg backdrop-blur-sm">
                🎓
              </div>
              <div>
                <p className="text-white/50 text-[11px] font-semibold tracking-[0.15em] uppercase">
                  Association IDSI
                </p>
                <p className="text-white/30 text-[10px]">Côte d&apos;Ivoire</p>
              </div>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-white/70 text-[11px] font-medium">En cours</span>
            </div>
          </div>

          {/* Title */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1 mb-4">
              <span className="text-blue-300 text-xs font-semibold tracking-wide">Programme 2026 – 2027</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Formations
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
                Anciens Diplômés IDSI
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-md">
              Suivez en temps réel l&apos;avancement du programme de montée en compétences — Data, IA, Leadership &amp; Entrepreneuriat.
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 pb-16 relative z-10 flex flex-col gap-5">

        {/* Stats grid — floats over hero */}
        <StatsGrid sessions={sessions} />

        {/* Progress */}
        <ProgramProgress done={done.length} total={sessions.length} sessions={sessions} />

        {/* Filter */}
        <FilterTabs current={filtre} counts={counts} />

        {/* Sessions */}
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-slate-800 font-semibold">Aucune session</p>
            <p className="text-slate-400 text-sm mt-1">Aucune session dans cette catégorie pour l&apos;instant.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([mois, group]) => (
            <section key={mois} className="flex flex-col gap-3">
              {/* Month header */}
              <div className="flex items-center gap-3 px-1 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.12em]">
                    {mois}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full shadow-sm">
                  {group.length} session{group.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-8 px-4 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎓</span>
            <div>
              <p className="text-xs font-semibold text-slate-600">IDSI Formations 2026</p>
              <p className="text-[11px] text-slate-400">Association des Anciens Diplômés IDSI · Côte d&apos;Ivoire</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300">Programme actif · {sessions.length} sessions</p>
        </div>
      </footer>
    </div>
  )
}
