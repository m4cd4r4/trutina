import type { RiskLevel } from '@/lib/types'

const config: Record<RiskLevel, { label: string; classes: string }> = {
  low:      { label: 'LOW',      classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  medium:   { label: 'MEDIUM',   classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  high:     { label: 'HIGH',     classes: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  critical: { label: 'CRITICAL', classes: 'bg-red-500/20 text-red-300 border-red-500/30' },
}

export default function RiskBadge({ level, size = 'sm' }: { level: RiskLevel | null; size?: 'sm' | 'md' }) {
  if (!level) return <span className="text-white/30 text-xs">—</span>
  const { label, classes } = config[level]
  const sizeClass = size === 'md' ? 'px-3 py-1 text-sm font-bold' : 'px-2 py-0.5 text-xs font-semibold'
  return (
    <span className={`inline-flex items-center rounded border ${classes} ${sizeClass} tracking-wider`}>
      {label}
    </span>
  )
}
