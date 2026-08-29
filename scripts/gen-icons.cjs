// Generates PNG app icons from the SVG sources for PWA / Android install.
// Run once: node scripts/gen-icons.cjs
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const ICON_DIR = path.join(__dirname, '..', 'public', 'icons')
const base = fs.readFileSync(path.join(ICON_DIR, 'icon.svg'))
const maskable = fs.readFileSync(path.join(ICON_DIR, 'icon-maskable.svg'))

// [source svg, output filename, size]
const jobs = [
  [base, 'icon-192.png', 192],
  [base, 'icon-512.png', 512],
  [maskable, 'icon-maskable-192.png', 192],
  [maskable, 'icon-maskable-512.png', 512],
  [base, 'apple-touch-icon.png', 180],
  [base, 'favicon-32.png', 32],
]

;(async () => {
  for (const [svg, name, size] of jobs) {
    await sharp(svg, { density: 384 })
      .resize(size, size)
      .png()
      .toFile(path.join(ICON_DIR, name))
    console.log('wrote', name, `(${size}x${size})`)
  }
  console.log('Done.')
})().catch(e => { console.error(e); process.exit(1) })
