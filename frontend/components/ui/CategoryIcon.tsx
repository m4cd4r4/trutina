import { Microscope, Bot, Link2, Calculator, Users, IdCard, type LucideProps } from 'lucide-react'
import type { FlagCategory } from '@/lib/types'

const ICONS: Record<FlagCategory, React.FC<LucideProps>> = {
  pdf_forensics: Microscope,
  ai_content: Bot,
  cross_reference: Link2,
  consistency: Calculator,
  broker_risk: Users,
  identity: IdCard,
}

const LABELS: Record<FlagCategory, string> = {
  pdf_forensics: 'PDF Forensics',
  ai_content: 'AI Content Detection',
  cross_reference: 'Cross-Reference',
  consistency: 'Consistency Check',
  broker_risk: 'Broker Risk',
  identity: 'Identity',
}

export function CategoryIcon({ category, className = 'w-5 h-5' }: { category: FlagCategory; className?: string }) {
  const Icon = ICONS[category]
  return <Icon className={className} />
}

export function getCategoryLabel(category: FlagCategory): string {
  return LABELS[category]
}
