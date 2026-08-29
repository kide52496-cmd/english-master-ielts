// Reusable premium audio visualizers.
// All decorative and CSS-only when possible to keep cost low.
import { useEffect, useState } from 'react'

// ProgressRing: SVG ring used for stats and timers.
// Props: pct (0..100), size, stroke, gradient (array of colors), label
export function ProgressRing({
  pct = 0,
  size = 96,
  stroke = 8,
  gradient = ['#6366f1', '#a855f7'],
  trackColor,
  children,
}) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - Math.min(Math.max(pct, 0), 100) / 100)
  const gradId = `pr-grad-${gradient.join('-').replace(/[^a-z0-9]/gi, '')}`
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1] || gradient[0]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={trackColor || 'currentColor'} strokeOpacity="0.15"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

// Waveform: animated 24-bar visualizer driven by CSS, plus an active prop
// to scale amplitude and color when audio is playing.
export function Waveform({
  active = false,
  bars = 28,
  color = 'from-teal-400 to-cyan-500',
  className = '',
}) {
  const items = Array.from({ length: bars })
  return (
    <div className={`flex items-end justify-center gap-[3px] h-12 ${className}`}>
      {items.map((_, i) => {
        // Pseudo-random heights but deterministic per index for a stable shape
        const baseH = 14 + Math.abs(Math.sin((i + 1) * 1.7)) * 30
        const delay = (i * 60) % 1000
        return (
          <span
            key={i}
            className={`block rounded-full bg-gradient-to-t ${color} transition-all`}
            style={{
              width: 3,
              height: `${active ? baseH : Math.max(6, baseH * 0.35)}px`,
              opacity: active ? 0.9 : 0.55,
              animation: active ? `waveform-bounce 1.1s ${delay}ms ease-in-out infinite` : 'none',
            }}
          />
        )
      })}
      <style>{`
        @keyframes waveform-bounce {
          0%, 100% { transform: scaleY(0.45); }
          50%      { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  )
}

// MicLevelBar: simulated mic level meter (no real audio analysis to avoid
// permission churn). When active=true, the meter pulses; when not, it sits low.
export function MicLevelBar({ active = false }) {
  const [v, setV] = useState(0.1)
  useEffect(() => {
    if (!active) { setV(0.05); return }
    let raf
    let last = performance.now()
    const tick = (t) => {
      if (t - last > 90) {
        last = t
        setV(0.25 + Math.random() * 0.7)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-150 ${active ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`}
        style={{ width: `${Math.round(v * 100)}%` }}
      />
    </div>
  )
}

// PremiumStatCard: rich stat card with gradient label, value, and optional
// progress ring or sparkline area.
export function PremiumStatCard({
  icon, label, value, sub, ring, color = 'from-indigo-500 to-purple-600',
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 card-hover">
      <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-gradient-to-br ${color} opacity-10`} />
      <div className="relative flex items-center gap-3">
        {ring !== undefined ? (
          <ProgressRing pct={ring} size={56} stroke={6} gradient={['#6366f1', '#ec4899']}>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{ring}%</span>
          </ProgressRing>
        ) : (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center text-xl shadow`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wider text-gray-400">{label}</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-0.5 animate-count-up">{value}</div>
          {sub && <div className="text-xs text-gray-400 mt-0.5 truncate">{sub}</div>}
        </div>
      </div>
    </div>
  )
}
