import { Session } from '@/lib/supabase'
import { pilierConfig } from './PilierBadge'

const statutConfig = {
  done:     { label: 'Réalisée',  chip: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  next:     { label: 'Prochaine', chip: 'bg-blue-100 text-blue-700 border-blue-200',           dot: 'bg-blue-500'    },
  upcoming: { label: 'À venir',   chip: 'bg-slate-100 text-slate-500 border-slate-200',       dot: 'bg-slate-300'   },
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  )
}

export function SessionCard({ session }: { session: Session }) {
  const st = statutConfig[session.statut]
  const pc = pilierConfig[session.pilier]
  const isDone = session.statut === 'done'
  const isNext = session.statut === 'next'
  const isUpcoming = session.statut === 'upcoming'

  return (
    <div className={`relative group rounded-2xl overflow-hidden transition-all duration-200 border ${
      isDone
        ? 'bg-white border-slate-100 shadow-premium hover:shadow-premium-hover'
        : isNext
        ? 'bg-white border-blue-200 shadow-premium hover:shadow-premium-hover ring-2 ring-blue-100'
        : 'bg-white/60 border-slate-100 shadow-sm'
    }`}>

      {/* ── Colored top strip ── */}
      <div className={`h-1 w-full ${pc.leftBar}`} />

      {/* ── Pulsing dot (next only) ── */}
      {isNext && (
        <div className="absolute top-4 right-4 z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
          </span>
        </div>
      )}

      <div className={`p-4 flex flex-col gap-3 ${isUpcoming ? 'opacity-55' : ''}`}>

        {/* ── Label + Statut ── */}
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
            {session.label}
          </span>
          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${st.chip}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </span>
        </div>

        {/* ── Title ── */}
        <p className={`text-sm font-bold leading-snug ${isDone || isNext ? 'text-slate-800' : 'text-slate-500'}`}>
          {session.titre}
        </p>

        {/* ── Pilier chip ── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${pc.bg} ${pc.text} ${pc.border}`}>
            <span className="text-base leading-none">{pc.icon}</span>
            {pc.label}
          </span>

          {/* Participants chip */}
          {isDone && (session.participants ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {session.participants} participants
            </span>
          )}
        </div>

        {/* ── Speaker + YouTube ── */}
        {(session.intervenant || (isDone && session.youtube_url) || isDone) && (
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">

            {session.intervenant && (
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full ${pc.iconBg} flex items-center justify-center text-xs font-extrabold ${pc.text} flex-shrink-0`}>
                  {session.intervenant.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mb-0.5">Intervenant</p>
                  {session.speaker_url ? (
                    <a
                      href={session.speaker_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline underline-offset-2 transition-colors flex items-center gap-1 truncate"
                    >
                      {session.intervenant}
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-xs font-bold text-slate-700 truncate">{session.intervenant}</p>
                  )}
                </div>
              </div>
            )}

            {isDone && session.youtube_url && (
              <a
                href={session.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/yt flex items-center gap-2.5 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-100 hover:border-red-200 rounded-xl px-3 py-2.5 transition-all duration-150"
              >
                <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover/yt:scale-105 transition-transform">
                  <YoutubeIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">Replay disponible</p>
                  <p className="text-xs font-bold text-red-700 truncate">Voir la vidéo de la session</p>
                </div>
                <svg className="w-4 h-4 text-red-300 group-hover/yt:translate-x-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}

            {session.slides_url && (
              <a
                href={session.slides_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/sl flex items-center gap-2.5 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 border border-indigo-100 hover:border-indigo-200 rounded-xl px-3 py-2.5 transition-all duration-150"
              >
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover/sl:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Support disponible</p>
                  <p className="text-xs font-bold text-indigo-700 truncate">Voir la présentation</p>
                </div>
                <svg className="w-4 h-4 text-indigo-300 group-hover/sl:translate-x-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}

            {/* Bouton évaluation — sessions réalisées uniquement */}
            {isDone && <a
              href={`/eval/${session.id}`}
              className="group/ev flex items-center gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-100 hover:border-amber-200 rounded-xl px-3 py-2.5 transition-all duration-150"
            >
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover/ev:scale-105 transition-transform text-sm">
                ⭐
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">Votre avis compte</p>
                <p className="text-xs font-bold text-amber-700 truncate">Évaluer cette session</p>
              </div>
              <svg className="w-4 h-4 text-amber-300 group-hover/ev:translate-x-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>}
          </div>
        )}
      </div>
    </div>
  )
}
