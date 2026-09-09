import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

// Register jest-axe's matcher with Vitest's expect. jest-axe is framework
// agnostic and only needs `expect.extend`.
expect.extend(toHaveNoViolations)

// `@types/jest-axe` augments Jest's matchers, not Vitest's, so declare the
// matcher on Vitest's assertion interfaces to keep `tsc` happy.
interface AxeMatchers<R = unknown> {
  toHaveNoViolations(): R
}
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends AxeMatchers<T> {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}

// jsdom does not implement matchMedia; useTheme and reduced-motion queries need it.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

afterEach(() => {
  cleanup()
})
