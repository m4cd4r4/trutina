import Image from 'next/image'
import Link from 'next/link'

type Variant = 'mark' | 'wordmark' | 'combo'

interface LogoProps {
  variant?: Variant
  href?: string
  height?: number
  className?: string
}

// The canonical Trutina logo, recoloured onto the cool-paper + ink-100
// palette by scripts/recolour-via-nano-banana.py (Gemini 3 Pro Image
// Preview). Preserves the T + balance pans + documents + divider + serif
// Trutina wordmark with the original outline-to-solid fade treatment.
// Aspect ratios match the source artwork.
const ASPECT: Record<Variant, number> = {
  mark: 1024 / 1024,     // 1:1 square (T + scales, no wordmark)
  wordmark: 1408 / 768,  // ~1.83:1 (T + scales + divider + Trutina)
  combo: 1408 / 768,
}

const FILE: Record<Variant, string> = {
  mark: '/logo/recoloured/mark-ink.png',
  wordmark: '/logo/recoloured/logo-ink.png',
  combo: '/logo/recoloured/logo-ink.png',
}

export function Logo({ variant = 'wordmark', href = '/', height = 28, className = '' }: LogoProps) {
  const width = Math.round(height * ASPECT[variant])
  const img = (
    <Image
      src={FILE[variant]}
      alt="Trutina"
      height={height}
      width={width}
      className={className}
      priority
      unoptimized
    />
  )
  if (href) return <Link href={href} className="flex items-center" style={{ textDecoration: 'none' }}>{img}</Link>
  return <span className="flex items-center">{img}</span>
}
