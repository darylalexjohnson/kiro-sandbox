import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Badge } from '../Badge'

describe('Badge accessibility', () => {
  it('has no violations for the neutral variant', async () => {
    const { container } = render(<Badge>Neutral</Badge>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations for the accent variant', async () => {
    const { container } = render(<Badge variant="accent">Accent</Badge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
