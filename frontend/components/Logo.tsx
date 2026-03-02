import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  variant?: 'combo' | 'mark' | 'wordmark' | 'text'
  href?: string
  height?: number
  className?: string
}

export function Logo({ variant = 'text', href = '/', height = 32, className = '' }: LogoProps) {
  const inner = variant === 'text' ? (
    <span className={`text-xl font-bold ${className}`}>
      Tru<span className="text-blue-400">tina</span>
    </span>
  ) : (
    <Image
      src={`/logo/${variant}.png`}
      alt="Trutina"
      height={height}
      width={variant === 'mark' ? height : height * (variant === 'combo' ? 4.5 : 3.5)}
      className={className}
      priority
    />
  )

  if (href) {
    return <Link href={href} className="flex items-center">{inner}</Link>
  }

  return <div className="flex items-center">{inner}</div>
}
