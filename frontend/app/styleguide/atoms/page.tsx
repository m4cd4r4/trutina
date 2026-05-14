'use client'

import {
  RiskBadge, ScoreOnScale, CalibrationTickRule, RejectStamp, MarginBar,
  CornerFrame, ProvenanceTag,
} from '@/components/design/atoms'
import ModuleCard from '@/components/design/ModuleCard'
import { aggregateModules } from '@/lib/case-modules'
import { FIXTURE_CASE } from '@/lib/styleguide-fixtures'
import { Logo } from '@/components/Logo'

export default function StyleguideAtoms() {
  const modules = aggregateModules(FIXTURE_CASE.flags)
  return (
    <main style={{ padding: '32px 64px', maxWidth: 1200, margin: '0 auto' }}>
      <h1>Atoms</h1>
      <p className="t-prose" style={{ marginTop: 8 }}>Visual preview of every shared component for /design review.</p>

      <Section title="Logos">
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <Logo variant="mark" height={64} href="" />
          <Logo variant="wordmark" height={32} href="" />
        </div>
      </Section>

      <Section title="RiskBadge (stamp-badge)">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <RiskBadge tier="crit" />
          <RiskBadge tier="high" />
          <RiskBadge tier="med" />
          <RiskBadge tier="low" />
        </div>
      </Section>

      <Section title="RiskBadge stark with score">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <RiskBadge tier="crit" stark score={82} />
          <RiskBadge tier="high" stark score={62} />
          <RiskBadge tier="med" stark score={41} />
          <RiskBadge tier="low" stark score={9} />
        </div>
      </Section>

      <Section title="ProvenanceTag">
        <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
          <ProvenanceTag kind="measured" />
          <ProvenanceTag kind="derived" />
          <ProvenanceTag kind="asserted" />
        </div>
      </Section>

      <Section title="ScoreOnScale">
        <ScoreOnScale value={82} />
        <div style={{ height: 32 }} />
        <ScoreOnScale value={41} />
        <div style={{ height: 32 }} />
        <ScoreOnScale value={9} />
      </Section>

      <Section title="CalibrationTickRule">
        <CalibrationTickRule />
      </Section>

      <Section title="ModuleCard (5-up grid)">
        <div className="modules-grid">
          {modules.map((m, i) => (
            <ModuleCard
              key={m.id}
              module={m}
              isActive={i === 0}
              isMuted={i !== 0}
              onClick={() => {}}
            />
          ))}
        </div>
      </Section>

      <Section title="RejectStamp">
        <div style={{ padding: 28, background: 'var(--paper-1)' }}>
          <RejectStamp tier="crit" sub="TRU-2026-04812 . 2026-04-09">REJECT</RejectStamp>
        </div>
      </Section>

      <Section title="CornerFrame (specimen)">
        <CornerFrame>
          <div className="specimen-head">
            <span className="lbl">Specimen</span>
            <span className="src">example.pdf . p.1/2</span>
          </div>
          <p className="t-body" style={{ margin: 0 }}>Specimen card content goes here.</p>
        </CornerFrame>
      </Section>

      <Section title="MarginBar (relative-positioned)">
        <div style={{ position: 'relative', padding: '12px 0 12px 16px', background: 'var(--paper-1)' }}>
          <MarginBar tier="crit" offsetLeft={0} />
          <div style={{ fontSize: 13 }}>Critical row with 6px margin bar.</div>
        </div>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ margin: '32px 0', padding: '24px 0', borderTop: '1px solid var(--rule)' }}>
      <h4 style={{ marginBottom: 16 }}>{title}</h4>
      {children}
    </section>
  )
}
