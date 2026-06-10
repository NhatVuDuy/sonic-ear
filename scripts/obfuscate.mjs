/**
 * Post-build obfuscation script.
 * Runs after `vite build` to obfuscate all JS chunks in dist/assets/.
 * Source files in src/ are never touched — this only affects production output.
 *
 * Run: node scripts/obfuscate.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import JavaScriptObfuscator from 'javascript-obfuscator'

const DIST_ASSETS = join(process.cwd(), 'dist', 'assets')
const OPTIONS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.3,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.1,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  unicodeEscapeSequence: false,
  sourceMap: false,
}

let total = 0, obfuscated = 0

const files = readdirSync(DIST_ASSETS).filter(f => extname(f) === '.js')

for (const file of files) {
  const filePath = join(DIST_ASSETS, file)
  const originalSize = statSync(filePath).size
  const code = readFileSync(filePath, 'utf-8')

  process.stdout.write(`  Obfuscating ${file} (${(originalSize / 1024).toFixed(1)} KB)...`)

  try {
    const result = JavaScriptObfuscator.obfuscate(code, OPTIONS)
    const obfCode = result.getObfuscatedCode()
    writeFileSync(filePath, obfCode, 'utf-8')
    const newSize = statSync(filePath).size
    console.log(` → ${(newSize / 1024).toFixed(1)} KB`)
    obfuscated++
  } catch (err) {
    console.log(` SKIP (error: ${err.message})`)
  }
  total++
}

console.log(`\nDone: ${obfuscated}/${total} files obfuscated.`)
