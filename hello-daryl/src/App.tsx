import { Badge, Button, Card, Stack } from './components'
import { useTheme } from './hooks/useTheme'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <main className="app">
      <div className="app__panel">
        <header className="app__header">
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
          <h1 className="app__title">Hello, Daryl</h1>
          <p className="app__subline">
            A tiny React + TypeScript starter with a hand-rolled design system.
          </p>
        </header>

        <Card>
          <Stack direction="column" gap={4}>
            <Badge variant="accent">New</Badge>
            <p className="app__card-text">
              These buttons are drawn entirely from design tokens — colours,
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
      </div>
    </main>
  )
}

export default App
