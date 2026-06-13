import { Session } from '@/lib/supabase'

type Props = { sessions: Session[] }

export function StatsGrid({ sessions }: Props) {
  const done = sessions.filter(s => s.statut === 'done')
  const next = sessions.find(s => s.statut === 'next')
  const totalParticipants = done.reduce((sum, s) => sum + (s.participants ?? 0), 0)
  const moyenne = done.length > 0 ? Math.round(totalParticipants / done.length) : 0
  const pct = sessions.length > 0 ? Math.round((done.length / sessions.length) * 100) : 0

  const cards = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: `${done.length}/${sessions.length}`,
      label: 'Sessions réalisées',
      sub: `${pct}% du programme`,
      iconBg: 'bg-emerald-500',
      accent: 'from-emerald-50 to-white',
      border: 'border-emerald-100',
      valueColor: 'text-emerald-700',
      subColor: 'text-emerald-500',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      value: totalParticipants > 0 ? totalParticipants.toLocaleString('fr-FR') : '—',
      label: 'Participants total',
      sub: 'toutes sessions',
      iconBg: 'bg-blue-500',
      accent: 'from-blue-50 to-white',
      border: 'border-blue-100',
      valueColor: 'text-blue-700',
      subColor: 'text-blue-400',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      value: done.length > 0 ? `${moyenne}` : '—',
      label: 'Moy. participants',
      sub: 'par session',
      iconBg: 'bg-violet-500',
      accent: 'from-violet-50 to-white',
      border: 'border-violet-100',
      valueColor: 'text-violet-700',
      subColor: 'text-violet-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${c.accent} rounded-2xl border ${c.border} shadow-premium p-4 flex flex-col gap-3 overflow-hidden relative`}
        >
          {/* Decorative circle */}
          <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full ${c.iconBg} opacity-[0.07]`} />

          {/* Icon */}
          <div className={`w-9 h-9 rounded-xl ${c.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
            {c.icon}
          </div>

          {/* Value */}
          <div>
            <p className={`text-2xl sm:text-3xl font-extrabold ${c.valueColor} leading-none tracking-tight tabular-nums`}>
              {c.value}
            </p>
            <p className={`text-[11px] mt-1 ${c.subColor} leading-tight`}>{c.sub}</p>
          </div>

          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
        </div>
      ))}
    </div>
  )
}
