'use client'

import type { ModuleAggregate, TierToken } from '@/lib/case-modules'

interface ModuleCardProps {
  module: ModuleAggregate
  isActive: boolean
  isMuted: boolean
  onClick: () => void
}

export default function ModuleCard({ module: m, isActive, isMuted, onClick }: ModuleCardProps) {
  const sevCls = m.severity === 'crit' ? 'has-crit' : m.severity === 'high' ? 'has-high' : ''
  const cls = [
    'module-card',
    sevCls,
    isActive ? 'is-active' : '',
    isMuted ? 'is-muted' : '',
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      aria-pressed={isActive}
      style={{
        font: 'inherit',
        color: 'inherit',
        textAlign: 'left',
        // Reset native button chrome that conflicts with .module-card.
        outlineOffset: 2,
      }}
    >
      <div className="name">{m.name}</div>
      <div className={`score ${m.severity}`}>{m.score}</div>
      <div className="flags">{m.flagCount} {m.flagCount === 1 ? 'flag' : 'flags'}</div>
      <div className="bar">
        <i style={{ width: `${m.score}%`, background: sevColor(m.severity) }} />
      </div>
      {isActive ? <span className="drill-tab" aria-hidden="true" /> : null}
    </button>
  )
}

function sevColor(s: TierToken): string {
  return `var(--risk-${s})`
}
