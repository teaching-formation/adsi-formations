import { Session } from '@/lib/supabase'

type Pilier = Session['pilier']

export const pilierConfig: Record<Pilier, {
  label: string
  bg: string
  text: string
  dot: string
  border: string
  leftBar: string
  iconBg: string
  icon: string
}> = {
  td: {
    label: 'Témoignages DSI',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
    leftBar: 'bg-blue-500',
    iconBg: 'bg-blue-100',
    icon: '🏢',
  },
  data: {
    label: 'Data Engineering',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
    leftBar: 'bg-emerald-500',
    iconBg: 'bg-emerald-100',
    icon: '📊',
  },
  ia: {
    label: 'IA & LLMs',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
    border: 'border-violet-200',
    leftBar: 'bg-violet-500',
    iconBg: 'bg-violet-100',
    icon: '🤖',
  },
  soft: {
    label: 'Soft Skills',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-200',
    leftBar: 'bg-amber-500',
    iconBg: 'bg-amber-100',
    icon: '💡',
  },
  entrepreneuriat: {
    label: 'Entrepreneuriat',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
    border: 'border-teal-200',
    leftBar: 'bg-teal-500',
    iconBg: 'bg-teal-100',
    icon: '🚀',
  },
}

export function PilierBadge({ pilier }: { pilier: Pilier }) {
  const c = pilierConfig[pilier]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className="text-sm leading-none">{c.icon}</span>
      {c.label}
    </span>
  )
}
