export default function MerciPage() {
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
        <h1 className="text-2xl font-extrabold text-white mb-3">Merci pour votre retour !</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Votre évaluation a bien été enregistrée. Vos retours nous aident à améliorer les futures sessions.
        </p>
        <a href="/"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-bold text-white text-sm transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Retour au programme
        </a>
      </div>
    </div>
  )
}
