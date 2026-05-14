import { redirect } from 'next/navigation'

// The live / route already renders against static marketing data with no
// API calls. Reuse it for the visual-regression baseline.
export default function StyleguideMarketing() {
  redirect('/')
}
