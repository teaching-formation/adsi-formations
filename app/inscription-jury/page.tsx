import { submitJuryVolontaire } from './actions'
import { DispoPicker } from './DispoPicker'

export const dynamic = 'force-dynamic'

const GROUPES = Array.from({ length: 11 }, (_, i) => `Jury ${i + 1}`)
const DOMAINES = ['Data', 'IA', 'Cybersécurité', 'Management']

const fieldStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }
const inputCls =
  'w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'

function Lbl({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">{children}</label>
}

export default function InscriptionJuryPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
      </div>

      <div className="relative w-full max-w-lg z-10">
        <div className="text-center mb-8">
          <div className="inline-flex bg-white rounded-2xl px-4 py-3 shadow-lg shadow-black/20 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/idsi-alumni-logo.jpeg" alt="IDSI Alumni" className="h-8 w-auto" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Jurys blancs — Aînés volontaires</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Simulations d&apos;entretien pour les étudiants. Inscrivez-vous comme <strong className="text-slate-200">recruteur / membre de jury</strong> et indiquez vos disponibilités.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 p-8 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {searchParams?.error && (
            <div className="rounded-xl px-4 py-3 mb-6 text-sm border"
              style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {searchParams.error === '1' ? 'Merci de remplir au moins Nom, Poste et Contact.' : 'Une erreur est survenue, réessayez.'}
            </div>
          )}

          <form action={submitJuryVolontaire} className="flex flex-col gap-5">
            <div>
              <Lbl>Nom &amp; Prénom <span className="text-red-400">*</span></Lbl>
              <input name="nom" required className={inputCls} style={fieldStyle} placeholder="Ex : KONE Awa" />
            </div>

            <div>
              <Lbl>Poste / Entreprise <span className="text-red-400">*</span></Lbl>
              <input name="poste" required className={inputCls} style={fieldStyle} placeholder="Ex : Directrice des Opérations, OCCS" />
            </div>

            <div>
              <Lbl>Numéro WhatsApp <span className="text-red-400">*</span></Lbl>
              <input name="contact" type="tel" required className={inputCls} style={fieldStyle} placeholder="Ex : 07 00 00 00 00" />
            </div>

            <div>
              <Lbl>LinkedIn (optionnel)</Lbl>
              <input name="linkedin" type="url" className={inputCls} style={fieldStyle} placeholder="https://linkedin.com/in/…" />
            </div>

            <div>
              <Lbl>Domaine d&apos;expertise</Lbl>
              <select name="domaine" defaultValue="" className={inputCls} style={fieldStyle}>
                <option value="" disabled className="text-slate-900">Choisir…</option>
                {DOMAINES.map(d => <option key={d} value={d} className="text-slate-900">{d}</option>)}
              </select>
            </div>

            <div>
              <Lbl>Groupe(s) que vous pouvez évaluer</Lbl>
              <p className="text-[11px] text-slate-500 mb-2.5">Cochez un ou plusieurs jurys, ou « Indifférent ».</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {['Indifférent', ...GROUPES].map(g => (
                  <label key={g} className="cursor-pointer">
                    <input type="checkbox" name="groupes" value={g} className="sr-only peer" />
                    <div className="text-center text-xs font-semibold py-2 px-1 rounded-lg border border-white/10 text-slate-400
                      peer-checked:border-blue-500 peer-checked:bg-blue-500/20 peer-checked:text-blue-200
                      hover:border-white/30 transition-all select-none">
                      {g}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Lbl>Vos disponibilités (dates &amp; plages horaires)</Lbl>
              <p className="text-[11px] text-slate-500 mb-2.5">Ajoutez autant de créneaux que nécessaire. Les dates des jurys seront fixées selon les disponibilités.</p>
              <DispoPicker />
            </div>

            <button type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white text-sm transition-all duration-200 mt-1"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              Je me porte volontaire →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
