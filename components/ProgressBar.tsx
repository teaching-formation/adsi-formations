'use client'

export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">Progression du programme</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {done} session{done !== 1 ? 's' : ''} réalisée{done !== 1 ? 's' : ''} sur {total}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold text-blue-600 tabular-nums">{pct}</span>
          <span className="text-lg font-bold text-blue-400">%</span>
        </div>
      </div>

      {/* Track */}
      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
        {/* Shimmer */}
        {pct > 0 && (
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
        )}
      </div>

      {/* Milestones */}
      <div className="flex justify-between mt-2">
        {[25, 50, 75, 100].map(m => (
          <span
            key={m}
            className={`text-[10px] font-medium ${pct >= m ? 'text-blue-500' : 'text-gray-300'}`}
          >
            {m}%
          </span>
        ))}
      </div>
    </div>
  )
}
