// First launch: pick which features to use. Shown once (`S.homeFeaturesSeen`), after mobile
// onboarding / permission steps. Everything stays reachable later in Settings → Look & Home.
import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { t } from '../lib/i18n.js'
import { HOME_FEATURES, initialHomeFeaturePicks } from '../lib/home-features.js'
import Icon from '../components/Icon.jsx'
import { Button, Section, Row, Switch } from '../components/ui.jsx'

export default function FeaturesSetup() {
  const update = useStore(s => s.update)
  const [picks, setPicks] = useState(initialHomeFeaturePicks)

  const set = (key, on) => setPicks(p => ({ ...p, [key]: on }))

  const finish = () => {
    update(s => {
      for (const f of HOME_FEATURES) s[f.key] = !!picks[f.key]
      s.homeFeaturesSeen = true
    })
  }

  const visible = HOME_FEATURES.filter(f => !f.needs || picks[f.needs])

  return (
    <div className="narrow" style={{ paddingBottom: 28 }}>
      <div style={{ textAlign: 'center', margin: '18px 0 8px' }}>
        <div style={{ fontSize: 44, display: 'flex', justifyContent: 'center', color: 'var(--acc)' }}>
          <Icon name="layout" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.024em', margin: '10px 0 8px' }}>
          {t('What do you want to use?')}
        </h1>
        <div className="muted" style={{ lineHeight: 1.5 }}>
          {t('Turn on only what you use. You can change this anytime in Settings.')}
        </div>
      </div>

      <Section title={t('Features')}>
        {visible.map(f => (
          <Row key={f.key} icon={f.icon} iconTint={f.tint} title={t(f.title)} subtitle={t(f.subtitle)}>
            <Switch checked={!!picks[f.key]} onChange={v => set(f.key, v)} aria-label={t(f.title)} />
          </Row>
        ))}
      </Section>

      <Button variant="primary" onClick={finish}>{t('Continue')}</Button>
      <div className="dim small" style={{ marginTop: 14, lineHeight: 1.5, textAlign: 'center' }}>
        {t('Later: Settings → Look & Home → Features.')}
      </div>
    </div>
  )
}
