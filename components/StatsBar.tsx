import { Session } from '@/lib/supabase'

type Props = { sessions: Session[] }

export function StatsBar({ sessions }: Props) {
  const done = sessions.filter(s => s.statut === 'done')
  const next = sessions.find(s => s.statut === 'next')
  const totalParticipants = done.reduce((sum, s) => sum + (s.participants ?? 0), 0)
  const moyenne = done.length > 0 ? Math.round(totalParticipants / done.length) : 0

  const stats = [
    {
      label: 'Sessions réalisées',
      value: `${done.length}`,
      sub: `sur ${sessions.length} au total`,
      icon: '✅',
      gradient: 'from-green-500 to-emerald-600',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-100',
      text: 'text-emerald-700',
      subText: 'text-emerald-500',
    },
    {
      label: 'Total participants',
      value: totalParticipants > 0 ? totalParticipants.toLocaleString('fr-FR') : '—',
      sub: 'toutes sessions confondues',
      icon: '👥',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      subText: 'text-blue-400',
    },
    {
      label: 'Moyenne / session',
      value: done.length > 0 ? `${moyenne}` : '—',
      sub: done.length > 0 ? 'participants en moyenne' : 'pas encore de données',
      icon: '📈',
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
      border: 'border-violet-100',
      text: 'text-violet-700',
      subText: 'text-violet-400',
    },
    {
      label: 'Prochaine session',
      value: next ? next.mois.split(' ')[0] : '—',
      sub: next ? next.titre : 'Programme terminé',
      icon: '📅',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      border: 'border-amber-100',
      text: 'text-amber-700',
      subText: 'text-amber-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {stats.map(s => (
        <div
          key={s.label}
          className={`relative overflow-hidden rounded-2xl border ${s.border} ${s.bg} p-4 sm:p-5 flex flex-col gap-2`}
        >
          {/* Decorative circle */}
          <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br ${s.gradient} opacity-10`} />

          <div className="flex items-center justify-between">
            <span className="text-2xl">{s.icon}</span>
          </div>

          <div>
            <p className={`text-2xl sm:text-3xl font-bold ${s.text} leading-none tracking-tight`}>
              {s.value}
            </p>
            <p className={`text-[11px] mt-1 ${s.subText} leading-tight line-clamp-2`}>{s.sub}</p>
          </div>

          <p className={`text-xs font-semibold ${s.text} opacity-70 uppercase tracking-wider`}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}
