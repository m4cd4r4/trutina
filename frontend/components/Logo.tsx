import Image from 'next/image'
import Link from 'next/link'

type Variant = 'mark' | 'wordmark'

interface LogoProps {
  variant?: Variant
  href?: string
  height?: number
  className?: string
}

// Aspect ratios of the calibration-tick SVGs in /public/logo/.
const ASPECT: Record<Variant, number> = {
  mark: 80 / 80,        // 1:1 square frame
  wordmark: 360 / 72,   // ~5:1
}

const FILE: Record<Variant, string> = {
  mark: '/logo/mark-calibration.svg',
  wordmark: '/logo/wordmark-calibration.svg',
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
