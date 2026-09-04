import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Splash } from '../Splash'

afterEach(() => {
  vi.useRealTimers()
})

describe('Splash', () => {
  it('renders the "Hello, Daryl" wordmark via its accessible name', () => {
    render(<Splash />)
    expect(screen.getByRole('heading', { name: 'Hello, Daryl' })).toBeInTheDocument()
  })

  it('exposes exactly one accessible heading', () => {
    render(<Splash />)
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('auto-focuses the Skip button', () => {
    render(<Splash />)
    expect(screen.getByRole('button', { name: 'Skip' })).toHaveFocus()
  })

  it('keeps decorative layers out of the accessibility tree', () => {
    const { container } = render(<Splash />)
    expect(container.querySelector('.splash__gradient')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(container.querySelector('.splash__blobs')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(container.querySelector('.splash__confetti')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    const letters = container.querySelectorAll('.splash__letter[aria-hidden="true"]')
    expect(letters.length).toBeGreaterThan(0)
  })

  it('exposes a dialog landmark', () => {
    render(<Splash />)
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument()
  })

  it('calls onDismiss when the Skip button is clicked', async () => {
    const onDismiss = vi.fn()
    const user = userEvent.setup()
    render(<Splash onDismiss={onDismiss} />)
    await user.click(screen.getByRole('button', { name: 'Skip' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('auto-dismisses after durationMs', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Splash onDismiss={onDismiss} durationMs={2200} />)
    expect(onDismiss).not.toHaveBeenCalled()
    vi.advanceTimersByTime(2200)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
