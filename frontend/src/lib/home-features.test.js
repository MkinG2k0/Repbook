import { describe, expect, it } from 'vitest'
import { HOME_FEATURES, freshHomeFeatureDefaults, initialHomeFeaturePicks, featureOn, statsFeaturesOff } from './home-features.js'

describe('home-features', () => {
  it('fresh defaults leave the picker unseen and optional cards off', () => {
    const d = freshHomeFeatureDefaults()
    expect(d.homeFeaturesSeen).toBe(false)
    expect(d.showWeekOnHome).toBe(true)
    expect(d.showWeightCard).toBe(false)
    expect(d.checkIn).toBe(false)
    expect(d.showStreakCard).toBe(false)
    expect(d.showWeightChart).toBe(false)
    expect(d.showMeasurements).toBe(false)
    expect(d.showProgressPhotos).toBe(false)
  })

  it('picker picks match the fresh defaults for every listed feature', () => {
    const picks = initialHomeFeaturePicks()
    for (const f of HOME_FEATURES) expect(picks[f.key]).toBe(f.freshDefault)
  })

  it('featureOn treats missing keys as on for legacy profiles', () => {
    expect(featureOn({}, 'showWeightCard')).toBe(true)
    expect(featureOn({ showWeightCard: false }, 'showWeightCard')).toBe(false)
  })

  it('statsFeaturesOff lists only Stats-scoped features that are off', () => {
    const off = statsFeaturesOff({ showWeightCard: false, showMeasurements: false, showProgressPhotos: false, checkIn: false })
    expect(off.map(f => f.key).sort()).toEqual(['showMeasurements', 'showProgressPhotos', 'showWeightCard'])
  })
})
