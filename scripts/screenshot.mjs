// Captures screenshots of the REAL built app using Playwright + Chromium.
//
// This runs in CI (GitHub Actions), where the npm registry is reachable, so it
// can install deps, build the app, serve the production bundle with `vite
// preview`, and drive it with a real browser. The authoring sandbox cannot do
// this because it has no npm registry access.
//
// Env:
//   BASE_URL  URL the preview server is serving (default http://127.0.0.1:4173)
//   OUT_DIR   directory to write PNGs into    (default docs/screenshots)

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT_DIR = process.env.OUT_DIR || 'docs/screenshots'

const THEME_KEY = 'hello-daryl-theme'

// view: 'splash' captures the animated intro; 'landing' skips it and captures
// the main screen.
const shots = [
  { name: 'app-splash-light-desktop', view: 'splash', theme: 'light', width: 1440, height: 900 },
  { name: 'app-splash-dark-desktop', view: 'splash', theme: 'dark', width: 1440, height: 900 },
  { name: 'app-landing-light-desktop', view: 'landing', theme: 'light', width: 1440, height: 900 },
  { name: 'app-landing-dark-desktop', view: 'landing', theme: 'dark', width: 1440, height: 900 },
  { name: 'app-splash-mobile', view: 'splash', theme: 'dark', width: 390, height: 844 },
  { name: 'app-landing-mobile', view: 'landing', theme: 'light', width: 390, height: 844 },
]

await mkdir(OUT_DIR, { recursive: true })

const browser = await chromium.launch()
try {
  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: { width: shot.width, height: shot.height },
      colorScheme: shot.theme, // drives prefers-color-scheme fallback
      deviceScaleFactor: 2, // crisp, retina-quality PNGs
    })

    // Force the app's persisted theme before any script runs.
    await context.addInitScript(
      ([key, value]) => {
        window.localStorage.setItem(key, value)
      },
      [THEME_KEY, shot.theme],
    )

    const page = await context.newPage()

    if (shot.view === 'splash') {
      // `?screenshot=splash` pins the splash on screen (no auto-dismiss), so the
      // capture is deterministic instead of racing the timer. `domcontentloaded`
      // keeps cold-start latency from pushing us past any timer.
      await page.goto(`${BASE_URL}/?screenshot=splash`, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('.splash', { state: 'visible', timeout: 5000 })
      // Short settle for the entrance animation to lay out before we freeze it.
      await page.waitForTimeout(400)
    } else {
      // `?screenshot=landing` starts with the splash already dismissed, so the
      // landing renders immediately — no dependency on clicking Skip.
      await page.goto(`${BASE_URL}/?screenshot=landing`, { waitUntil: 'domcontentloaded' })
      // Graceful fallback: dismiss a Skip button if one is somehow present.
      const skip = page.getByRole('button', { name: 'Skip' })
      if (await skip.count()) {
        await skip.click()
      }
      await page.waitForSelector('.app__title', { state: 'visible', timeout: 5000 })
      await page.waitForTimeout(600)
    }

    const file = path.join(OUT_DIR, `${shot.name}.png`)
    // `animations: 'disabled'` finishes CSS animations to their end state for a
    // deterministic frame.
    await page.screenshot({ path: file, animations: 'disabled' })
    console.log(`captured ${file}`)

    await context.close()
  }
} finally {
  await browser.close()
}
