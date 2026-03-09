import Image from 'next/image'
import Link from 'next/link'

const ASPECT_RATIOS: Record<string, number> = {
  combo: 1212 / 330,    // ~3.67:1 (cropped)
  mark: 323 / 269,      // ~1.20:1 (cropped)
  wordmark: 767 / 190,  // ~4.04:1 (cropped)
}

interface LogoProps {
  variant?: 'combo' | 'mark' | 'wordmark' | 'text'
  href?: string
  height?: number
  className?: string
}

export function Logo({ variant = 'text', href = '/', height = 32, className = '' }: LogoProps) {
  const inner = variant === 'text' ? (
    <span className={`text-xl font-bold ${className}`}>
      Tru<span className="text-teal-400">tina</span>
    </span>
  ) : (
    <Image
      src={`/logo/${variant}.png`}
      alt="Trutina"
      height={height}
      width={Math.round(height * (ASPECT_RATIOS[variant] ?? 1))}
      className={className}
      priority
      unoptimized
    />
  )

  if (href) {
    return <Link href={href} className="flex items-center">{inner}</Link>
  }

  return <div className="flex items-center">{inner}</div>
}
