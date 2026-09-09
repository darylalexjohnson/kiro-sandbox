// Full-page accessibility scan of the REAL built app using @axe-core/playwright
// + Chromium.
//
// This runs in CI (GitHub Actions), where the npm registry is reachable, so it
// can install deps, build the app, serve the production bundle with `vite
// preview`, and drive it with a real browser. The authoring sandbox cannot do
// this because it has no npm registry access. Unlike Layer 1 (jsdom + jest-axe),
// a real browser has a layout engine, so the `color-contrast` rule and other
// layout-dependent checks are meaningful here.
//
// Env:
//   BASE_URL  URL the preview server is serving (default http://127.0.0.1:4173)
//   OUT_DIR   directory to write the report into (default docs/a11y)
//
// Always exits 0. The consolidated JSON report carries a top-level `hasCritical`
// boolean (true when any serious/critical violation exists) that the workflow
// reads to decide pass/fail.

import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT_DIR = process.env.OUT_DIR || 'docs/a11y'

const THEME_KEY = 'hello-daryl-theme'
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
const IMPACTS = ['minor', 'moderate', 'serious', 'critical']

// view: 'splash' scans the animated intro; 'landing' scans the main screen.
const states = [
  { name: 'landing-light-desktop', view: 'landing', theme: 'light', width: 1440, height: 900 },
  { name: 'landing-dark-desktop', view: 'landing', theme: 'dark', width: 1440, height: 900 },
  { name: 'landing-light-mobile', view: 'landing', theme: 'light', width: 390, height: 844 },
  { name: 'landing-dark-mobile', view: 'landing', theme: 'dark', width: 390, height: 844 },
  { name: 'splash-light-desktop', view: 'splash', theme: 'light', width: 1440, height: 900 },
  { name: 'splash-dark-desktop', view: 'splash', theme: 'dark', width: 1440, height: 900 },
]

await mkdir(OUT_DIR, { recursive: true })

const results = []

const browser = await chromium.launch()
try {
  for (const state of states) {
    const context = await browser.newContext({
      viewport: { width: state.width, height: state.height },
      colorScheme: state.theme, // drives prefers-color-scheme fallback
    })

    // Force the app's persisted theme before any script runs.
    await context.addInitScript(
      ([key, value]) => {
        window.localStorage.setItem(key, value)
      },
      [THEME_KEY, state.theme],
    )

    const page = await context.newPage()

    if (state.view === 'splash') {
      // `?screenshot=splash` pins the splash on screen (no auto-dismiss).
      await page.goto(`${BASE_URL}/?screenshot=splash`, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('.splash', { state: 'visible', timeout: 5000 })
      await page.waitForTimeout(400)
    } else {
      // `?screenshot=landing` starts with the splash already dismissed.
      await page.goto(`${BASE_URL}/?screenshot=landing`, { waitUntil: 'domcontentloaded' })
      const skip = page.getByRole('button', { name: 'Skip' })
      if (await skip.count()) {
        await skip.click()
      }
      await page.waitForSelector('.app__title', { state: 'visible', timeout: 5000 })
      await page.waitForTimeout(600)
    }

    const axeResults = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()

    const counts = { minor: 0, moderate: 0, serious: 0, critical: 0 }
    for (const violation of axeResults.violations) {
      const impact = violation.impact || 'minor'
      if (impact in counts) {
        counts[impact] += violation.nodes.length
      }
    }

    results.push({
      state: state.name,
      view: state.view,
      theme: state.theme,
      viewport: { width: state.width, height: state.height },
      url: page.url(),
      counts,
      violations: axeResults.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        helpUrl: violation.helpUrl,
        description: violation.description,
        nodes: violation.nodes.length,
        selectors: violation.nodes.map((node) => node.target.join(', ')),
      })),
    })

    console.log(
      `scanned ${state.name}: ${axeResults.violations.length} violation rule(s) ` +
        `(minor ${counts.minor}, moderate ${counts.moderate}, ` +
        `serious ${counts.serious}, critical ${counts.critical})`,
    )

    await context.close()
  }
} finally {
  await browser.close()
}

// Aggregate totals and derive the pass/fail signal.
const totals = { minor: 0, moderate: 0, serious: 0, critical: 0 }
for (const result of results) {
  for (const impact of IMPACTS) {
    totals[impact] += result.counts[impact]
  }
}
const hasCritical = totals.serious > 0 || totals.critical > 0

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  wcagTags: WCAG_TAGS,
  hasCritical,
  totals,
  states: results,
}

const jsonPath = path.join(OUT_DIR, 'accessibility-report.json')
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

// Human-readable Markdown report.
const lines = []
lines.push('# Accessibility report')
lines.push('')
lines.push(`Generated: ${report.generatedAt}`)
lines.push('')
lines.push(`Base URL: \`${BASE_URL}\``)
lines.push('')
lines.push(`WCAG tags: ${WCAG_TAGS.map((t) => `\`${t}\``).join(', ')}`)
lines.push('')
lines.push(
  `Result: ${hasCritical ? '❌ serious/critical violations found' : '✅ no serious/critical violations'}`,
)
lines.push('')
lines.push('## Summary')
lines.push('')
lines.push('| State | Minor | Moderate | Serious | Critical |')
lines.push('| --- | --- | --- | --- | --- |')
for (const result of results) {
  lines.push(
    `| ${result.state} | ${result.counts.minor} | ${result.counts.moderate} | ` +
      `${result.counts.serious} | ${result.counts.critical} |`,
  )
}
lines.push(
  `| **Total** | **${totals.minor}** | **${totals.moderate}** | ` +
    `**${totals.serious}** | **${totals.critical}** |`,
)
lines.push('')
lines.push('## Violations')
lines.push('')
const anyViolations = results.some((result) => result.violations.length > 0)
if (!anyViolations) {
  lines.push('No violations detected across the scanned states. 🎉')
  lines.push('')
} else {
  for (const result of results) {
    lines.push(`### ${result.state}`)
    lines.push('')
    if (result.violations.length === 0) {
      lines.push('No violations.')
      lines.push('')
      continue
    }
    for (const violation of result.violations) {
      lines.push(`- **${violation.id}** (${violation.impact || 'n/a'}) — ${violation.help}`)
      lines.push(`  - Help: ${violation.helpUrl}`)
      lines.push(`  - Affected selectors:`)
      for (const selector of violation.selectors) {
        lines.push(`    - \`${selector}\``)
      }
    }
    lines.push('')
  }
}

const mdPath = path.join(OUT_DIR, 'accessibility-report.md')
await writeFile(mdPath, `${lines.join('\n')}`, 'utf8')

console.log('')
console.log('Accessibility scan summary')
console.log('--------------------------')
for (const result of results) {
  console.log(
    `${result.state.padEnd(24)} minor ${result.counts.minor}  moderate ${result.counts.moderate}  ` +
      `serious ${result.counts.serious}  critical ${result.counts.critical}`,
  )
}
console.log(
  `${'TOTAL'.padEnd(24)} minor ${totals.minor}  moderate ${totals.moderate}  ` +
    `serious ${totals.serious}  critical ${totals.critical}`,
)
console.log('')
console.log(`hasCritical (serious/critical present): ${hasCritical}`)
console.log(`Wrote ${jsonPath}`)
console.log(`Wrote ${mdPath}`)

// Always exit 0; the workflow reads `hasCritical` from the JSON to gate.
process.exitCode = 0
