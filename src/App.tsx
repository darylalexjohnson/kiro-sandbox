import { useState } from 'react'
import { BackgroundFX, Badge, Button, Card, Splash, Stack } from './components'
import { useTheme } from './hooks/useTheme'
import './App.css'

// Large finite timer so the splash stays pinned for deterministic screenshots
// (`setTimeout` coerces `Infinity` unreliably, often firing immediately).
const SPLASH_PIN_MS = 60 * 60 * 1000

function App() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  // Screenshot capture hook: `?screenshot=splash` pins the splash on screen,
  // `?screenshot=landing` starts with it dismissed. Any other value (including
  // none) keeps the default behaviour for real users.
  const screenshotView = new URLSearchParams(window.location.search).get('screenshot')
  const [showSplash, setShowSplash] = useState(screenshotView !== 'landing')

  return (
    <>
      <BackgroundFX />
      {showSplash && (
        <Splash
          onDismiss={() => setShowSplash(false)}
          durationMs={screenshotView === 'splash' ? SPLASH_PIN_MS : undefined}
        />
      )}
      <main className="app">
        <div className="app__inner">
          <div className="app__toolbar">
            <Badge variant="accent">v0.0.0</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </div>

          <section className="app__hero">
            <header className="app__hero-copy">
              <h1 className="app__title">Hello, Daryl</h1>
              <p className="app__subline">
                A tiny React + TypeScript starter with a hand-rolled design system.
              </p>
              <Stack direction="row" gap={3}>
                <Button variant="primary">Get started</Button>
                <Button variant="ghost">Learn more</Button>
              </Stack>
            </header>

            <div className="app__bento">
              <Card>
                <Stack direction="column" gap={4}>
                  <Badge variant="accent">Buttons</Badge>
                  <p className="app__card-text">
                    Every control is drawn entirely from design tokens — colours,
                    spacing, radii, and typography all flow from CSS custom properties.
                  </p>
                  <Stack direction="row" gap={3}>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                  </Stack>
                  <Button variant="secondary" disabled>
                    Disabled
                  </Button>
                </Stack>
              </Card>

              <Card>
                <Stack direction="column" gap={4}>
                  <h2 className="app__card-title">Badges</h2>
                  <Stack direction="row" gap={3}>
                    <Badge variant="neutral">Neutral</Badge>
                    <Badge variant="accent">Accent</Badge>
                  </Stack>
                  <p className="app__card-text">Clean pills with a hairline ring.</p>
                </Stack>
              </Card>

              <Card>
                <Stack direction="column" gap={4}>
                  <h2 className="app__card-title">Design tokens</h2>
                  <p className="app__card-text">
                    A three-layer system: raw ramps, semantic aliases, then per-theme
                    overrides — so light and dark stay perfectly in sync.
                  </p>
                </Stack>
              </Card>

              <Card>
                <Stack direction="column" gap={4}>
                  <h2 className="app__card-title">Frosted glass</h2>
                  <p className="app__card-text">
                    Translucent surfaces, a backdrop blur, hairline borders, and a soft
                    ambient glow float above a slowly breathing gradient mesh.
                  </p>
                </Stack>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default App
