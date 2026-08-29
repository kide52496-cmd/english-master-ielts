// Generates Android launcher icons (all densities) from the SVG sources,
// replacing Capacitor's default icons. Run: node scripts/gen-android-icons.cjs
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const ICON_DIR = path.join(__dirname, '..', 'public', 'icons')
const RES = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res')
const base = fs.readFileSync(path.join(ICON_DIR, 'icon.svg'))            // full-bleed
const maskable = fs.readFileSync(path.join(ICON_DIR, 'icon-maskable.svg')) // padded (for adaptive foreground)

// Legacy launcher icon sizes per density.
const LAUNCHER = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
}
// Adaptive foreground is 108dp; render larger per density.
const FOREGROUND = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432,
}

;(async () => {
  for (const [dir, size] of Object.entries(LAUNCHER)) {
    const out = path.join(RES, dir)
    if (!fs.existsSync(out)) continue
    // Square + round legacy icons use the full-bleed base.
    await sharp(base, { density: 384 }).resize(size, size).png().toFile(path.join(out, 'ic_launcher.png'))
    await sharp(base, { density: 384 }).resize(size, size).png().toFile(path.join(out, 'ic_launcher_round.png'))
    console.log('launcher', dir, `${size}x${size}`)
  }
  for (const [dir, size] of Object.entries(FOREGROUND)) {
    const out = path.join(RES, dir)
    if (!fs.existsSync(out)) continue
    // Adaptive foreground: maskable SVG already has safe-zone padding.
    await sharp(maskable, { density: 384 }).resize(size, size).png().toFile(path.join(out, 'ic_launcher_foreground.png'))
    console.log('foreground', dir, `${size}x${size}`)
  }
  console.log('Done. Android launcher icons replaced.')
})().catch(e => { console.error(e); process.exit(1) })
