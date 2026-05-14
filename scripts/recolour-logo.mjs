// One-off: recolour the existing Trutina justice/balance scales SVG
// onto the new cool-paper + ink palette. The originals are raster-traced
// (~300 paths each across a teal gradient), so a flat lightness threshold
// destroys the gradient and erases the scales silhouette.
//
// Correct strategy: the very FIRST <path> in each file is the dark teal
// background rectangle (M0 0h1024v1024H0z). It becomes paper. Every
// subsequent path is part of the scales artwork; its fill becomes ink-100
// regardless of original shade. The scales render as a solid graphite
// silhouette on paper.
//
// Run: node scripts/recolour-logo.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', 'frontend', 'public', 'logo')

const PAPER = '#F0F1ED'      // var(--paper-0)
const INK_100 = '#141618'    // var(--ink-100)

async function recolour(src, dst) {
  const buf = await readFile(src, 'utf8')
  // Walk every fill="#hex" occurrence. The first one is the background
  // rectangle (it's always at the head of the <svg>); it becomes paper.
  // Everything after becomes ink-100.
  let first = true
  const out = buf.replace(/fill="(#[0-9a-fA-F]{6})"/g, () => {
    if (first) { first = false; return `fill="${PAPER}"` }
    return `fill="${INK_100}"`
  })
  await writeFile(dst, out)
  console.log(`${src} -> ${dst}`)
}

await recolour(join(root, 'mark.svg'),     join(root, 'mark-inked.svg'))
await recolour(join(root, 'wordmark.svg'), join(root, 'wordmark-inked.svg'))
await recolour(join(root, 'combo.svg'),    join(root, 'combo-inked.svg'))
console.log('done')
