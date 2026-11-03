import { getAdminSession } from '@/lib/session'
import { sql } from '@/lib/db'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const GROUPES = Array.from({ length: 11 }, (_, i) => `Jury ${i + 1}`)

type Volontaire = {
  id: number; nom: string; poste: string | null; contact: string; linkedin: string | null;
  domaine: string | null; groupes: string | null; disponibilites: string | null
}
type Candidat = {
  id: number; nom: string; promotion: string | null; contact: string; poste_vise: string | null; groupe: string | null
}

async function getData() {
  try {
    const [vol, cand] = await Promise.all([
      sql`SELECT * FROM jury_volontaires ORDER BY created_at DESC`,
      sql`SELECT * FROM jury_candidats ORDER BY created_at DESC`,
    ])
    return { vol: vol as Volontaire[], cand: cand as Candidat[] }
  } catch {
    return { vol: [] as Volontaire[], cand: [] as Candidat[] }
  }
}

export default async function AdminJuryPage() {
  if (!(await getAdminSession())) redirect('/admin')
  const { vol, cand } = await getData()

  const aineFor = (g: string) =>
    vol.filter(v => (v.groupes ?? '').split(',').map(s => s.trim()).some(x => x === g || x === 'Indifférent'))
  const candFor = (g: string) => cand.filter(c => c.groupe === g)

  return (
    <div className="min-h-screen" style={{ background: '#0d1117' }}>
      <header className="sticky top-0 z-30 border-b"
        style={{ background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-sm">⚖️</div>
            <p className="text-sm font-bold text-white">Jurys blancs · Organisation</p>
          </div>
          <a href="/admin" className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>← Admin</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* KPI */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Aînés volontaires', value: vol.length, color: '#60a5fa' },
            { label: 'Étudiants inscrits', value: `${cand.length}/41`, color: '#34d399' },
            { label: 'Groupes avec étudiants', value: GROUPES.filter(g => candFor(g).length > 0).length, color: '#a78bfa' },
          ].map(k => (
            <div key={k.label} className="rounded-xl p-4 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xl font-extrabold tabular-nums" style={{ color: k.color }}>{k.value}</p>
              <p className="text-[11px] mt-0.5" style={{ color: '#475569' }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Par groupe */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: '#475569' }}>Composition par jury</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GROUPES.map(g => {
              const cs = candFor(g); const as = aineFor(g)
              const full = cs.length >= 4
              return (
                <div key={g} className="rounded-xl border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: full ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-sm font-bold text-white">{g}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color: full ? '#34d399' : '#94a3b8', background: full ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.04)' }}>
                      {cs.length}/4 étudiants
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Étudiants</p>
                    {cs.length ? cs.map(c => (
                      <p key={c.id} className="text-xs text-slate-300">• {c.nom}{c.promotion ? ` — ${c.promotion}` : ''}</p>
                    )) : <p className="text-xs" style={{ color: '#334155' }}>—</p>}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#475569' }}>Aînés dispo</p>
                    {as.length ? as.map(a => (
                      <p key={a.id} className="text-xs text-blue-300">• {a.nom}{a.domaine ? ` (${a.domaine})` : ''}</p>
                    )) : <p className="text-xs" style={{ color: '#334155' }}>aucun pour l&apos;instant</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Détail aînés (dispos) */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest px-1" style={{ color: '#475569' }}>
            Aînés volontaires — disponibilités
          </h2>
          {vol.length === 0 ? (
            <p className="text-xs" style={{ color: '#334155' }}>Aucun aîné volontaire pour l&apos;instant.</p>
          ) : vol.map(v => (
            <div key={v.id} className="rounded-xl border px-4 py-3" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm font-semibold text-white">{v.nom} <span className="text-slate-500 font-normal">· {v.poste}</span></p>
                <span className="text-[11px] text-slate-400">{v.contact}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex flex-col gap-0.5">
                {v.domaine && <p><span style={{ color: '#64748b' }}>Domaine : </span>{v.domaine}</p>}
                {v.groupes && <p><span style={{ color: '#64748b' }}>Groupes : </span>{v.groupes}</p>}
                {v.disponibilites && <p><span style={{ color: '#64748b' }}>Dispos : </span>{v.disponibilites}</p>}
                {v.linkedin && <a href={v.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400">LinkedIn ↗</a>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
