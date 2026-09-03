import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { Button } from './Button'
import './Splash.css'

export interface SplashProps {
  onDismiss?: () => void
  durationMs?: number
}

const TITLE = 'Hello, Daryl'

export function Splash({ onDismiss, durationMs = 2200 }: SplashProps) {
  const skipRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onDismiss?.()
    }, durationMs)

    return () => {
      window.clearTimeout(timer)
    }
  }, [durationMs, onDismiss])

  useEffect(() => {
    skipRef.current?.querySelector('button')?.focus()
  }, [])

  const handleDismiss = () => {
    onDismiss?.()
  }

  return (
    <div className="splash" role="dialog" aria-modal="true" aria-label="Welcome">
      <div className="splash__panel">
        <span className="splash__glow" aria-hidden="true" />
        <h1 className="splash__title" aria-label={TITLE}>
          {TITLE.split('').map((char, index) => (
            <span
              key={index}
              className="splash__letter"
              aria-hidden="true"
              style={{ '--i': index } as CSSProperties}
            >
              {char}
            </span>
          ))}
        </h1>
        <span ref={skipRef} className="splash__skip">
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Skip
          </Button>
        </span>
      </div>
    </div>
  )
}
