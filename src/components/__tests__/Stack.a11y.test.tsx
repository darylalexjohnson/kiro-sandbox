import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Stack } from '../Stack'
import { Button } from '../Button'

describe('Stack accessibility', () => {
  it('has no violations in the row direction', async () => {
    const { container } = render(
      <Stack direction="row" gap={3}>
        <Button>One</Button>
        <Button variant="secondary">Two</Button>
      </Stack>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no violations in the column direction', async () => {
    const { container } = render(
      <Stack direction="column" gap={4}>
        <Button>One</Button>
        <Button variant="secondary">Two</Button>
      </Stack>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
