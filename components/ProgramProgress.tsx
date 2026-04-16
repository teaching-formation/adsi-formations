'use client'

import { Session } from '@/lib/supabase'

const pilierColors: Record<string, string> = {
  td: 'bg-blue-500',
  data: 'bg-emerald-500',
  ia: 'bg-violet-500',
  soft: 'bg-amber-500',
  entrepreneuriat: 'bg-teal-500',
}

const pilierLabels: Record<string, string> = {
  td: 'TD',
  data: 'Data',
  ia: 'IA',
  soft: 'Soft',
  entrepreneuriat: 'Entrepr.',
}

export function ProgramProgress({
  done, total, sessions
}: {
  done: number
  total: number
  sessions: Session[]
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  // Pilier breakdown
  const piliers = ['td', 'data', 'ia', 'soft', 'entrepreneuriat']
  const pilierStats = piliers.map(p => {
    const all  = sessions.filter(s => s.pilier === p)
    const done = all.filter(s => s.statut === 'done')
    return { pilier: p, total: all.length, done: done.length }
  })

  return (
    <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
      {/* Top section */}
      <div className="p-5 sm:p-6">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Avancement global
            </p>
            <p className="text-slate-800 font-semibold text-sm">
              {done} session{done !== 1 ? 's' : ''} réalisée{done !== 1 ? 's' : ''} sur {total}
            </p>
          </div>
          {/* Big percentage */}
          <div className="text-right">
            <span className="text-5xl font-black text-slate-800 tabular-nums leading-none">{pct}</span>
            <span className="text-xl font-bold text-slate-400 ml-1">%</span>
          </div>
        </div>

        {/* Main progress bar */}
        <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
          {/* Gloss */}
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)'
            }}
          />
        </div>

        {/* Step markers */}
        <div className="flex justify-between mt-2.5 px-0.5">
          {[0, 25, 50, 75, 100].map(m => (
            <div key={m} className="flex flex-col items-center gap-0.5">
              <div className={`w-1 h-1 rounded-full ${pct >= m ? 'bg-indigo-500' : 'bg-slate-200'}`} />
              <span className={`text-[10px] font-semibold ${pct >= m ? 'text-indigo-500' : 'text-slate-300'}`}>
                {m}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pilier breakdown */}
      <div className="border-t border-slate-50 px-5 sm:px-6 py-4 bg-slate-50/50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Par pilier</p>
        <div className="flex flex-col gap-2">
          {pilierStats.map(p => {
            const pilierPct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0
            return (
              <div key={p.pilier} className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-slate-500 w-14 shrink-0">
                  {pilierLabels[p.pilier]}
                </span>
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pilierColors[p.pilier]} transition-all duration-700`}
                    style={{ width: `${pilierPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400 w-10 text-right tabular-nums">
                  {p.done}/{p.total}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
