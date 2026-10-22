// The workout screen and the Coach chat own the bottom of the screen; the tab bar must stay away.
// Shell is not rendered in a test, so this reads the condition from the source.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

const app = readFileSync(new URL('./App.jsx', import.meta.url), 'utf8')

describe('the tab bar', () => {
  it('stays away from the workout and the coach chat', () => {
    const cond = app.match(/const noTabs = ([^\n]+)/)?.[1] || ''
    expect(cond).toContain('inWorkout')
    expect(cond).toContain("/coach")
    expect(cond).not.toContain('needsMobileOnboarding')
    expect(app).toMatch(/\{!noTabs && <TabBar /)
  })
})
