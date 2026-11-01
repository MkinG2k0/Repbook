// @vitest-environment happy-dom
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import { useStore } from '../store/useStore.js'
import { freshState } from '../store/useStore.js'
import FeaturesSetup from './FeaturesSetup.jsx'

let host, root
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  useStore.setState({ S: freshState(), user: null })
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })

const switchFor = title => {
  const row = [...host.querySelectorAll('.lrow')].find(r => r.querySelector('.lrow-t')?.textContent === title)
  return row?.querySelector('[role="switch"]')
}
const continueBtn = () => [...host.querySelectorAll('button')].find(b => b.textContent === 'Continue')

describe('FeaturesSetup', () => {
  it('lists features with fresh defaults and says Settings can change them', () => {
    act(() => root.render(<FeaturesSetup />))
    expect(host.textContent).toContain('What do you want to use?')
    expect(host.textContent).toContain('Settings → Look & Home → Features')
    expect(switchFor('Week strip').getAttribute('aria-checked')).toBe('true')
    expect(switchFor('Body weight').getAttribute('aria-checked')).toBe('false')
    expect(switchFor('Body measurements').getAttribute('aria-checked')).toBe('false')
    expect(switchFor('Progress photos').getAttribute('aria-checked')).toBe('false')
    expect(switchFor('Gym check-in').getAttribute('aria-checked')).toBe('false')
    expect(switchFor('Streak card').getAttribute('aria-checked')).toBe('false')
    expect(switchFor('Weight chart')).toBeFalsy()
  })

  it('writes picks and marks the picker seen on Continue', () => {
    act(() => root.render(<FeaturesSetup />))
    act(() => { switchFor('Body weight').click() })
    act(() => { switchFor('Streak card').click() })
    act(() => { continueBtn().click() })
    const S = useStore.getState().S
    expect(S.homeFeaturesSeen).toBe(true)
    expect(S.showWeekOnHome).toBe(true)
    expect(S.showWeightCard).toBe(true)
    expect(S.showStreakCard).toBe(true)
    expect(S.checkIn).toBe(false)
    expect(S.showWeightChart).toBe(false)
    expect(S.showMeasurements).toBe(false)
  })
})
