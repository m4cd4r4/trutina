'use client'

import { useEffect } from 'react'
import { trackPageview } from '@/lib/analytics'

export default function PageTracker() {
  useEffect(() => { trackPageview() }, [])
  return null
}
