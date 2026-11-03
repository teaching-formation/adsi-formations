import { submitCandidat } from './actions'

export const dynamic = 'force-dynamic'

const GROUPES = Array.from({ length: 11 }, (_, i) => `Jury ${i + 1}`)
const PROMOS = ['Master 1', 'Master 2', 'Autre']

const fieldStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
const inputCls =
  'w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'

function Lbl({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">{children}</label>
}

export default function InscriptionCandidatPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #052e23 50%, #0f172a 100%)' }}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <div className="inline-flex bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/20 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/idsi-alumni-logo.jpeg" alt="IDSI Alumni" className="h-8 w-auto" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Jurys blancs — Inscription étudiant</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Entraîne-toi aux entretiens face à un jury d&apos;aînés. Inscris-toi et choisis ton groupe de passage.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 p-8 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {searchParams?.error && (
            <div className="rounded-xl px-4 py-3 mb-6 text-sm border"
              style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {searchParams.error === '1' ? 'Merci de remplir Nom, Contact et de choisir un groupe.' : 'Une erreur est survenue, réessayez.'}
            </div>
          )}

          <form action={submitCandidat} className="flex flex-col gap-5">
            <div>
              <Lbl>Nom &amp; Prénom <span className="text-red-400">*</span></Lbl>
              <input name="nom" required className={inputCls} style={fieldStyle} placeholder="Ex : DIALLO Mariam" />
            </div>

            <div>
              <Lbl>Promotion</Lbl>
              <select name="promotion" defaultValue="" className={inputCls} style={fieldStyle}>
                <option value="" disabled className="text-slate-900">Choisir…</option>
                {PROMOS.map(p => <option key={p} value={p} className="text-slate-900">{p}</option>)}
              </select>
            </div>

            <div>
              <Lbl>Contact (téléphone ou email) <span className="text-red-400">*</span></Lbl>
              <input name="contact" required className={inputCls} style={fieldStyle} placeholder="07 00 00 00 00 / nom@mail.com" />
            </div>

            <div>
              <Lbl>Poste / domaine visé (optionnel)</Lbl>
              <input name="poste_vise" className={inputCls} style={fieldStyle} placeholder="Ex : Data Analyst, DevOps…" />
            </div>

            <div>
              <Lbl>Groupe de passage <span className="text-red-400">*</span></Lbl>
              <p className="text-[11px] text-slate-500 mb-2.5">Choisis ton jury (date fixée ensuite selon les aînés).</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {GROUPES.map(g => (
                  <label key={g} className="cursor-pointer">
                    <input type="radio" name="groupe" value={g} required className="sr-only peer" />
                    <div className="text-center text-xs font-semibold py-2.5 px-1 rounded-lg border border-white/10 text-slate-400
                      peer-checked:border-emerald-500 peer-checked:bg-emerald-500/20 peer-checked:text-emerald-200
                      hover:border-white/30 transition-all select-none">
                      {g}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all duration-200 mt-1"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' }}>
              Je m&apos;inscris →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
