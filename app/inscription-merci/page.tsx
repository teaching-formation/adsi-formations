export const dynamic = 'force-dynamic'

export default function MerciInscriptionPage({ searchParams }: { searchParams: { role?: string } }) {
  const isAine = searchParams?.role === 'aine'
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
      </div>

      <div className="relative text-center z-10 max-w-sm">
        <div className="inline-flex w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl items-center justify-center text-4xl shadow-2xl shadow-emerald-500/30 mb-6">
          ✅
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-3">Inscription enregistrée !</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          {isAine
            ? 'Merci de vous porter volontaire. L’organisation vous recontactera avec le planning du/des jury(s) selon vos disponibilités.'
            : 'Ton inscription au jury blanc est bien prise en compte. La date de ton groupe te sera communiquée prochainement.'}
        </p>
      </div>
    </div>
  )
}
