'use client'

import { useState, useTransition } from 'react'
import { Session } from '@/lib/supabase'
import { PilierBadge, pilierConfig } from './PilierBadge'
import { updateSessionAction } from '@/app/admin/actions'

type Statut = 'upcoming' | 'next' | 'done'

const statutOptions: {
  value: Statut
  label: string
  activeStyle: React.CSSProperties
  inactiveStyle: React.CSSProperties
}[] = [
  {
    value: 'done',
    label: 'Réalisée',
    activeStyle: { background: 'rgba(52,211,153,0.2)', border: '1px solid rgba(52,211,153,0.4)', color: '#34d399' },
    inactiveStyle: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569' },
  },
  {
    value: 'next',
    label: 'Prochaine',
    activeStyle: { background: 'rgba(96,165,250,0.2)', border: '1px solid rgba(96,165,250,0.4)', color: '#60a5fa' },
    inactiveStyle: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569' },
  },
  {
    value: 'upcoming',
    label: 'À venir',
    activeStyle: { background: 'rgba(148,163,184,0.2)', border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8' },
    inactiveStyle: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569' },
  },
]

function DarkInput({
  value,
  onChange,
  onBlur,
  placeholder,
  icon,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  placeholder?: string
  icon?: React.ReactNode
  type?: string
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full py-2.5 pr-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        style={{
          paddingLeft: icon ? '2.25rem' : '0.75rem',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#e2e8f0',
        }}
      />
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#475569' }}>
      {children}
    </label>
  )
}

export function AdminSessionCard({ session }: { session: Session }) {
  const [titre, setTitre]               = useState(session.titre)
  const [participants, setParticipants] = useState(session.participants ?? 0)
  const [statut, setStatut]             = useState<Statut>(session.statut as Statut)
  const [intervenant, setIntervenant]   = useState(session.intervenant ?? '')
  const [speakerUrl, setSpeakerUrl]     = useState(session.speaker_url ?? '')
  const [youtubeUrl, setYoutubeUrl]     = useState(session.youtube_url ?? '')
  const [slidesUrl, setSlidesUrl]       = useState(session.slides_url ?? '')
  const [saveMsg, setSaveMsg]           = useState<'saved' | 'error' | null>(null)
  const [isPending, startTransition]    = useTransition()

  const pc = pilierConfig[session.pilier]

  const flash = (result: 'saved' | 'error') => {
    setSaveMsg(result)
    setTimeout(() => setSaveMsg(null), 2000)
  }

  const save = (
    field: 'titre' | 'participants' | 'statut' | 'intervenant' | 'speaker_url' | 'youtube_url' | 'slides_url',
    value: string | number,
    original: string | number | null
  ) => {
    if (value === (original ?? '')) return
    startTransition(async () => {
      try {
        await updateSessionAction(session.id, field, value)
        flash('saved')
      } catch {
        flash('error')
      }
    })
  }

  const borderColor = statut === 'done'
    ? 'rgba(52,211,153,0.15)'
    : statut === 'next'
    ? 'rgba(96,165,250,0.2)'
    : 'rgba(255,255,255,0.06)'

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${borderColor}` }}
    >
      {/* Colored top strip */}
      <div className={`h-0.5 w-full ${pc.leftBar}`} />

      <div className="p-4 flex flex-col gap-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ color: '#475569', background: 'rgba(255,255,255,0.05)' }}>
              #{session.id}
            </span>
            <PilierBadge pilier={session.pilier} />
            <span className="text-[11px] hidden sm:inline" style={{ color: '#334155' }}>{session.label}</span>
          </div>

          {/* Save indicator */}
          <div className="shrink-0 h-5 flex items-center">
            {isPending && (
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: '#475569' }}>
                <div className="w-3 h-3 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
                <span>Sauvegarde…</span>
              </div>
            )}
            {!isPending && saveMsg === 'saved' && (
              <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: '#34d399' }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Sauvegardé
              </span>
            )}
            {!isPending && saveMsg === 'error' && (
              <span className="text-[11px] font-medium" style={{ color: '#f87171' }}>⚠ Erreur</span>
            )}
          </div>
        </div>

        {/* ── Titre ── */}
        <div>
          <FieldLabel>Titre de la session</FieldLabel>
          <DarkInput
            value={titre}
            onChange={setTitre}
            onBlur={() => save('titre', titre, session.titre)}
            placeholder="Titre de la session…"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />
        </div>

        {/* ── Participants + Statut ── */}
        <div className="flex gap-3 flex-wrap">
          {/* Participants */}
          <div className="flex-1 min-w-[110px]">
            <FieldLabel>Participants</FieldLabel>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#475569' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="number"
                min={0}
                value={participants}
                onChange={e => setParticipants(parseInt(e.target.value) || 0)}
                onBlur={() => save('participants', participants, session.participants)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
              />
            </div>
          </div>

          {/* Statut */}
          <div className="flex-[2] min-w-[210px]">
            <FieldLabel>Statut</FieldLabel>
            <div className="flex gap-1.5">
              {statutOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatut(opt.value)
                    save('statut', opt.value, session.statut)
                  }}
                  className="flex-1 py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-150"
                  style={statut === opt.value ? opt.activeStyle : opt.inactiveStyle}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>
            Intervenant &amp; Médias
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* ── Intervenant ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Nom de l&apos;intervenant</FieldLabel>
            <DarkInput
              value={intervenant}
              onChange={setIntervenant}
              onBlur={() => save('intervenant', intervenant, session.intervenant)}
              placeholder="Prénom Nom…"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>

          <div>
            <FieldLabel>Profil (LinkedIn / site)</FieldLabel>
            <DarkInput
              value={speakerUrl}
              onChange={setSpeakerUrl}
              onBlur={() => save('speaker_url', speakerUrl, session.speaker_url)}
              placeholder="https://linkedin.com/in/…"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
            />
          </div>
        </div>

        {/* ── YouTube URL ── */}
        <div>
          <FieldLabel>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#f87171' }}>
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
              Lien vidéo YouTube
            </span>
          </FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#f87171' }}>
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
              </svg>
            </span>
            <input
              type="url"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              onBlur={() => save('youtube_url', youtubeUrl, session.youtube_url)}
              placeholder="https://youtube.com/watch?v=…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
            />
          </div>

          {youtubeUrl && (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] transition-colors hover:opacity-80"
              style={{ color: '#f87171' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Vérifier le lien →
            </a>
          )}
        </div>

        {/* ── Support de présentation ── */}
        <div>
          <FieldLabel>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#818cf8' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Support de présentation
            </span>
          </FieldLabel>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#818cf8' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <input
              type="url"
              value={slidesUrl}
              onChange={e => setSlidesUrl(e.target.value)}
              onBlur={() => save('slides_url', slidesUrl, session.slides_url)}
              placeholder="https://docs.google.com/presentation/… ou Canva, PDF…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
            />
          </div>
          {slidesUrl && (
            <a href={slidesUrl} target="_blank" rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] transition-colors hover:opacity-80"
              style={{ color: '#818cf8' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Vérifier le lien →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
