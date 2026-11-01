// @vitest-environment happy-dom
// The finish summary is a full-screen page (kind: 'page'), not a cramped centered dialog.
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import { DEF, useStore } from './store/useStore.js'
import { useUI } from './store/useUI.js'
import { finishWorkoutNow } from './sheets.jsx'
import Modals from './components/Modals.jsx'

const clone = v => JSON.parse(JSON.stringify(v))

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  localStorage.clear()
  useUI.setState({ sheets: [], timer: null, work: null })
  const st = clone(DEF)
  st.active = {
    id: 'fin', d: '2026-09-28', start: Date.now() - 20 * 60000, routineIds: [], name: 'Solo',
    bw: null, cur: 0,
    entries: [{ id: '0025', target: { sets: 1, reps: 5, weight: 60 }, sets: [{ w: 60, r: 5, done: true }] }],
  }
  useStore.setState({ S: st, user: null })
})
afterEach(() => { useUI.setState({ sheets: [] }) })

describe('finish summary as a page', () => {
  it('opens as kind page with page chrome, not a centered dialog', () => {
    act(() => finishWorkoutNow())
    const sheet = useUI.getState().sheets.at(-1)
    expect(sheet.kind).toBe('page')
    expect(sheet.locked).toBe(true)

    const host = document.createElement('div')
    document.body.appendChild(host)
    const root = createRoot(host)
    act(() => root.render(<Modals />))
    expect(host.querySelector('.sheet-page')).toBeTruthy()
    expect(host.querySelector('.fin-page')).toBeTruthy()
    expect(host.querySelector('.fin-page-bar')).toBeTruthy()
    expect(host.querySelector('.fin-page-foot')).toBeTruthy()
    expect(host.querySelector('.center')).toBeNull()
    expect(host.textContent).toContain('Workout complete!')
    expect(host.textContent).toContain('Nice!')
    act(() => root.unmount())
    host.remove()
  })
})
