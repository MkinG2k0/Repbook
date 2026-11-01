// @vitest-environment happy-dom
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { useStore } from '../store/useStore.js'
import Stats from './Stats.jsx'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../sheets.jsx', () => ({
  bwSheet: vi.fn(), goalSheet: vi.fn(), calendarSheet: vi.fn(), dayOverrideSheet: vi.fn(),
  workoutDetailSheet: vi.fn(), exerciseHistorySheet: vi.fn(), WorkoutRow: () => null,
  bwDeltaColor: () => '', weighInsSheet: vi.fn(),
}))
vi.mock('../components/ReportSheet.jsx', () => ({ reportSheet: vi.fn() }))

let host, root
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })

const mount = over => {
  useStore.setState(s => ({
    S: {
      ...s.S, routines: [], workouts: [], bodyweight: [], measurements: [], dayPlan: {}, week: {},
      active: null, unit: 'kg', showWeightCard: true, showMeasurements: true, ...over,
    },
    user: null,
  }))
  act(() => root.render(<Stats />))
}

describe('Stats feature flags', () => {
  it('hides body weight, measurements and photos when off, lists them under Turned off', () => {
    mount({ showWeightCard: false, showMeasurements: false, showProgressPhotos: false, workouts: [{ id: 'w1', start: Date.now(), entries: [] }] })
    // Full cards gone; titles only appear inside the Turned-off Enable rows.
    expect(host.querySelector('.bw-head')).toBeNull()
    expect(host.querySelector('[data-stats-photos]')).toBeNull()
    expect([...host.querySelectorAll('button')].some(b => b.textContent === 'Open' && b.closest('.card')?.textContent?.includes('Body measurements'))).toBe(false)
    expect(host.querySelector('.stats-off')).toBeTruthy()
    expect(host.querySelector('[data-stats-enable="showWeightCard"]')).toBeTruthy()
    expect(host.querySelector('[data-stats-enable="showMeasurements"]')).toBeTruthy()
    expect(host.querySelector('[data-stats-enable="showProgressPhotos"]')).toBeTruthy()
    expect(host.querySelector('[data-stats-enable="checkIn"]')).toBeNull()
  })

  it('Enable turns a Stats feature back on', () => {
    mount({ showWeightCard: false })
    const card = host.querySelector('[data-stats-enable="showWeightCard"]')
    act(() => { [...card.querySelectorAll('button')].find(b => b.textContent === 'Enable').click() })
    expect(useStore.getState().S.showWeightCard).toBe(true)
  })
})
