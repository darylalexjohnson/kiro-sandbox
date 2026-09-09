import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Card } from '../Card'

describe('Card accessibility', () => {
  it('has no violations with child content', async () => {
    const { container } = render(
      <Card>
        <p>Card body</p>
      </Card>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations with an extra className', async () => {
    const { container } = render(
      <Card className="extra">
        <p>Card body</p>
      </Card>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
