'use client'

export default function ScoreGauge({ score, size = 120 }: { score: number | null; size?: number }) {
  if (score === null) return <div className="text-white/30 text-sm">Not analysed</div>

  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - score) / 100) * circumference

  const color =
    score >= 70 ? '#ef4444' :
    score >= 45 ? '#f97316' :
    score >= 20 ? '#f59e0b' :
    '#10b981'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-white" style={{ color }}>{score}</div>
        <div className="text-xs text-white/50">/100</div>
      </div>
    </div>
  )
}
