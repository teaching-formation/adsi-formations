'use client'

import { useState } from 'react'

type Slot = { date: string; from: string; to: string }

const cellStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  colorScheme: 'dark' as const,
}

function label(s: Slot): string | null {
  if (!s.date) return null
  const d = new Date(s.date + 'T00:00')
  const jour = d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' })
  const h = s.from && s.to ? ` ${s.from}–${s.to}` : s.from ? ` dès ${s.from}` : ''
  return jour + h
}

export function DispoPicker() {
  const [slots, setSlots] = useState<Slot[]>([{ date: '', from: '', to: '' }])

  const setField = (i: number, k: keyof Slot, v: string) =>
    setSlots(s => s.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)))
  const add = () => setSlots(s => [...s, { date: '', from: '', to: '' }])
  const remove = (i: number) => setSlots(s => (s.length === 1 ? s : s.filter((_, idx) => idx !== i)))

  const serialized = slots.map(label).filter(Boolean).join(' ; ')
  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="flex flex-col gap-2.5">
      <input type="hidden" name="disponibilites" value={serialized} />

      {slots.map((row, i) => (
        <div key={i} className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-[130px]">
            <span className="block text-[10px] text-slate-500 mb-1">Date</span>
            <input type="date" min={todayStr} value={row.date}
              onChange={e => setField(i, 'date', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={cellStyle} />
          </div>
          <div className="w-[88px]">
            <span className="block text-[10px] text-slate-500 mb-1">De</span>
            <input type="time" value={row.from}
              onChange={e => setField(i, 'from', e.target.value)}
              className="w-full px-2 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={cellStyle} />
          </div>
          <div className="w-[88px]">
            <span className="block text-[10px] text-slate-500 mb-1">À</span>
            <input type="time" value={row.to}
              onChange={e => setField(i, 'to', e.target.value)}
              className="w-full px-2 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={cellStyle} />
          </div>
          <button type="button" onClick={() => remove(i)} disabled={slots.length === 1}
            className="h-[42px] w-9 flex items-center justify-center rounded-lg text-slate-400 disabled:opacity-30 hover:text-red-300 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            aria-label="Retirer ce créneau">✕</button>
        </div>
      ))}

      <button type="button" onClick={add}
        className="self-start text-xs font-semibold px-3 py-2 rounded-lg transition-all"
        style={{ color: '#93c5fd', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
        + Ajouter un créneau
      </button>
    </div>
  )
}
