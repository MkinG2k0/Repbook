// @vitest-environment happy-dom
// Home feature toggles (Settings → Look & Home → Home features): week strip, weight chart, streak.
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { useStore } from '../store/useStore.js'
import Home from './Home.jsx'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../sheets.jsx', () => ({
  starterPlanSheet: vi.fn(), bwSheet: vi.fn(), goalSheet: vi.fn(), dayOverrideSheet: vi.fn(),
  calendarSheet: vi.fn(), startFlow: vi.fn(), bwDeltaColor: () => '', weighInsSheet: vi.fn(),
}))

let host, root
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })

const mountWith = over => {
  useStore.setState(s => ({
    S: {
      ...s.S, routines: [], workouts: [], bodyweight: [{ d: '2024-01-01', w: 80 }],
      dayPlan: {}, week: {}, active: null, unit: 'kg', ...over,
    },
    user: null,
  }))
  act(() => root.render(<Home />))
}

const weekStrip = () => host.querySelector('.week')
const weightChart = () => host.querySelector('.chart')
const streakCard = () => [...host.querySelectorAll('.card')].find(c => c.textContent.includes('week streak'))
const todayRow = () => host.querySelector('.today-row')

describe('Home feature toggles', () => {
  it('shows week, chart and streak for legacy profiles without the preferences', () => {
    mountWith({ showWeekOnHome: undefined, showWeightChart: undefined, showStreakCard: undefined, showWeightCard: true })
    expect(weekStrip()).toBeTruthy()
    expect(weightChart()).toBeTruthy()
    expect(streakCard()).toBeTruthy()
    expect(todayRow()).toBeTruthy()
  })

  it('hides the week strip when turned off, keeps Today', () => {
    mountWith({ showWeekOnHome: false })
    expect(weekStrip()).toBeFalsy()
    expect(todayRow()).toBeTruthy()
  })

  it('hides only the weight chart when turned off', () => {
    mountWith({ showWeightCard: true, showWeightChart: false })
    expect([...host.querySelectorAll('h2')].find(el => el.textContent === 'Body weight')).toBeTruthy()
    expect(weightChart()).toBeFalsy()
  })

  it('hides the streak card when turned off', () => {
    mountWith({ showStreakCard: false })
    expect(streakCard()).toBeFalsy()
  })
})
