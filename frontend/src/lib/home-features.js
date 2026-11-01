// Features the user can turn off (Settings → Look & Home). Off hides the feature across the
// app; data stays. First launch (views/FeaturesSetup.jsx) asks once; older profiles without
// `homeFeaturesSeen` keep everything on via DEF defaults and never see the picker.
//
// `stats: true` → when off, Stats lists it under “Turned off” with an Enable button (only
// features that belong on Stats — gym check-in does not).

export const HOME_FEATURES = [
  {
    key: 'showWeekOnHome',
    icon: 'calendar',
    tint: 'var(--orange)',
    title: 'Week strip',
    subtitle: 'Show the week strip on Home.',
    freshDefault: true,
    homeOnly: true,
  },
  {
    key: 'checkIn',
    icon: 'qr',
    tint: 'var(--blue)',
    title: 'Gym check-in',
    subtitle: 'Membership QR codes. Off hides them everywhere.',
    freshDefault: false,
    stats: false,
  },
  {
    key: 'showWeightCard',
    icon: 'scale',
    tint: 'var(--green)',
    title: 'Body weight',
    subtitle: 'Weigh-ins and weight cards. Off hides them everywhere.',
    freshDefault: false,
    stats: true,
    statsBlurb: 'Log weigh-ins, see the curve and the weekly rate.',
  },
  {
    key: 'showWeightChart',
    icon: 'chart',
    tint: 'var(--teal)',
    title: 'Weight chart',
    subtitle: 'Show the weight chart on the Home card.',
    freshDefault: false,
    homeOnly: true,
    needs: 'showWeightCard',
  },
  {
    key: 'showMeasurements',
    icon: 'ruler',
    tint: 'var(--purple)',
    title: 'Body measurements',
    subtitle: 'Waist, arms and the rest. Off hides them everywhere.',
    freshDefault: false,
    stats: true,
    statsBlurb: 'Waist, arms, body fat and anything else you measure, each with its own curve.',
  },
  {
    key: 'showProgressPhotos',
    icon: 'camera',
    tint: 'var(--teal)',
    title: 'Progress photos',
    subtitle: 'Progress photos. Off hides them everywhere.',
    freshDefault: false,
    stats: true,
    statsBlurb: 'Every progress photo, lined up by date, for any day. Plus a before/after slider.',
  },
  {
    key: 'showStreakCard',
    icon: 'flame',
    tint: 'var(--orange)',
    title: 'Streak card',
    subtitle: 'Show the streak card on Home.',
    freshDefault: false,
    homeOnly: true,
  },
]

/** Feature is on (legacy profiles without the key read as on). */
export const featureOn = (S, key) => S?.[key] !== false

/** Stats features currently switched off — for the “Turned off” fold. */
export function statsFeaturesOff(S) {
  return HOME_FEATURES.filter(f => f.stats && !featureOn(S, f.key))
}

/** Defaults applied on a brand-new profile (freshState) before the first-run picker. */
export function freshHomeFeatureDefaults() {
  const out = { homeFeaturesSeen: false }
  for (const f of HOME_FEATURES) out[f.key] = f.freshDefault
  return out
}

/** Starting picks for the first-run screen (matches freshHomeFeatureDefaults). */
export function initialHomeFeaturePicks() {
  const out = {}
  for (const f of HOME_FEATURES) out[f.key] = f.freshDefault
  return out
}
