import { sql, Session } from '@/lib/db'
import { SessionCard } from '@/components/SessionCard'

export const revalidate = 60

export const metadata = {
  title: 'Masterclass réalisées — IDSI Formations 2026',
  description: 'Revivez les masterclass de l\'Association des Anciens Diplômés IDSI : replays vidéo et supports de présentation.',
}

async function getDoneSessions(): Promise<Session[]> {
  try {
    const rows = await sql`SELECT * FROM sessions WHERE statut = 'done' ORDER BY id DESC`
    return rows as Session[]
  } catch (e) {
    console.error(e)
    return []
  }
}

export default async function ReplaysPage() {
  const sessions = await getDoneSessions()
  const totalParticipants = sessions.reduce((sum, s) => sum + (s.participants ?? 0), 0)
  const withReplay = sessions.filter(s => s.youtube_url).length

  // Regroupement par mois (ordre déjà décroissant : plus récent en premier)
  const grouped = sessions.reduce<Record<string, Session[]>>((acc, s) => {
    if (!acc[s.mois]) acc[s.mois] = []
    acc[s.mois].push(s)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ── HERO ── */}
      <div className="mesh-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-28">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white rounded-xl px-3 py-2 shadow-lg shadow-black/20 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/idsi-alumni-logo.jpeg" alt="IDSI Alumni" className="h-7 w-auto" />
            </div>
            <p className="text-white/40 text-[10px] font-medium tracking-wide">Côte d&apos;Ivoire</p>
          </div>

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 text-xs font-semibold tracking-wide">Replays &amp; supports</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Masterclass
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                déjà réalisées
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-md">
              Revivez les sessions de montée en compétences des Anciens Diplômés IDSI — vidéos et supports de présentation en accès libre.
            </p>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <p className="text-xl font-extrabold text-white tabular-nums">{sessions.length}</p>
                <p className="text-[11px] text-white/40 font-medium">Masterclass</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <p className="text-xl font-extrabold text-white tabular-nums">{withReplay}</p>
                <p className="text-[11px] text-white/40 font-medium">Replays vidéo</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                <p className="text-xl font-extrabold text-white tabular-nums">{totalParticipants || '—'}</p>
                <p className="text-[11px] text-white/40 font-medium">Participants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 pb-16 relative z-10">
        {sessions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-premium p-12 text-center">
            <p className="text-2xl mb-3">🎬</p>
            <p className="text-slate-800 font-semibold">Aucune masterclass pour l&apos;instant</p>
            <p className="text-slate-400 text-sm mt-1">Les replays apparaîtront ici après chaque session.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {Object.entries(grouped).map(([mois, group]) => (
              <section key={mois} className="flex flex-col gap-3">
                {/* En-tête de mois */}
                <div className="flex items-center gap-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.12em]">{mois}</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
                  <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-full shadow-sm">
                    {group.length} masterclass
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-8 px-4 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/idsi-alumni-logo.jpeg" alt="IDSI Alumni" className="h-7 w-auto" />
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-600">IDSI Formations 2026</p>
            <p className="text-[11px] text-slate-400">Association des Anciens Diplômés IDSI · Côte d&apos;Ivoire</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
