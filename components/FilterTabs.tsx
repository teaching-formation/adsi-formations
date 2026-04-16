'use client'

import { useRouter } from 'next/navigation'

const tabs = [
  {
    key: 'toutes',
    label: 'Toutes',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    key: 'realisees',
    label: 'Réalisées',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'avenir',
    label: 'À venir',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function FilterTabs({ current, counts }: {
  current: string
  counts: { toutes: number; realisees: number; avenir: number }
}) {
  const router = useRouter()

  return (
    <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-premium border border-slate-100">
      {tabs.map(tab => {
        const count = counts[tab.key as keyof typeof counts]
        const isActive = current === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.key === 'toutes' ? '/' : `/?filtre=${tab.key}`)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-slate-400'}>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[20px] text-center ${
              isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
