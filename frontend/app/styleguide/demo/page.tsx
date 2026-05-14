import { redirect } from 'next/navigation'

// The live /demo route already renders against synthetic DEMO_CASES with
// no API calls. Reuse it for the visual-regression baseline.
export default function StyleguideDemo() {
  redirect('/demo')
}
