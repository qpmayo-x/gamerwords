import { t } from '../lib/i18n.js'

export function NavBar({ current, onNavigate, lang }) {
  const tabs = [
    { id: 'home', label: t(lang, 'home'), icon: '\u{1F3E0}' },
    { id: 'dictionary', label: t(lang, 'dictionary'), icon: '\u{1F4D6}' },
    { id: 'settings', label: t(lang, 'settings'), icon: '\u{2699}\u{FE0F}' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)',
      display: 'flex', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{ display: 'flex', maxWidth: 480, width: '100%' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1, padding: '10px 0 8px', border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: current === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontSize: 11, fontWeight: current === tab.id ? 700 : 400,
              transition: 'color 0.2s ease',
            }}
          >
            <span style={{ fontSize: 20, position: 'relative', display: 'inline-block' }}>
              {tab.icon}
              {current === tab.id && (
                <span style={{
                  position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 6px var(--color-accent)',
                }} />
              )}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
