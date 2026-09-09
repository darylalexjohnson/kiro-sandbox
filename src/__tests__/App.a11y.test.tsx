import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import App from '../App'

describe('App accessibility', () => {
  it('has no violations on initial mount (splash over landing)', async () => {
    const { container } = render(<App />)
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations after the splash is dismissed', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Skip' }))
    await waitFor(() => {
      expect(container.querySelector('.app__title')).not.toBeNull()
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
