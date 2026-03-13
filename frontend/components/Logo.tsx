import Image from 'next/image'
import Link from 'next/link'

const ASPECT_RATIOS: Record<string, number> = {
  combo: 1212 / 330,    // ~3.67:1 (cropped)
  mark: 323 / 269,      // ~1.20:1 (cropped)
  wordmark: 767 / 190,  // ~4.04:1 (cropped)
}

interface LogoProps {
  variant?: 'combo' | 'mark' | 'wordmark' | 'text' | 'brand'
  href?: string
  height?: number
  className?: string
}

export function Logo({ variant = 'brand', href = '/', height = 32, className = '' }: LogoProps) {
  let inner: React.ReactNode

  if (variant === 'text') {
    inner = (
      <span className={`text-xl font-bold ${className}`}>
        Tru<span className="text-teal-400">tina</span>
      </span>
    )
  } else if (variant === 'brand') {
    // Mark icon + styled text — the primary logo variant
    const markSize = height
    const markWidth = Math.round(markSize * (ASPECT_RATIOS.mark ?? 1))
    inner = (
      <span className={`flex items-center gap-1.5 ${className}`}>
        <Image
          src="/logo/mark.png"
          alt=""
          height={markSize}
          width={markWidth}
          className="shrink-0"
          priority
          unoptimized
        />
        <span className="font-bold leading-none" style={{ fontSize: `${Math.round(height * 0.7)}px` }}>
          <span className="text-white">Tru</span>
          <span className="text-teal-400">tina</span>
        </span>
      </span>
    )
  } else {
    inner = (
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
  }

  if (href) {
    return <Link href={href} className="flex items-center">{inner}</Link>
  }

  return <div className="flex items-center">{inner}</div>
}
