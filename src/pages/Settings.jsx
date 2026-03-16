import { THEMES } from '../lib/themes.js'

export function Settings({ currentTheme, setTheme }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 24 }}>
        {'\u{2699}\u{FE0F}'} Settings
      </h2>

      {/* Theme picker */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
          Theme
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {Object.entries(THEMES).map(([id, theme]) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              style={{
                padding: 14, borderRadius: 12, cursor: 'pointer',
                border: currentTheme === id ? `2px solid ${theme.accent}` : '2px solid transparent',
                background: theme.bgCard,
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 24 }}>{theme.emoji}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>{theme.name}</div>
                <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                  {[theme.accent, theme.success, theme.error, theme.warning].map((c, i) => (
                    <div key={i} style={{
                      width: 12, height: 12, borderRadius: '50%', background: c,
                    }} />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* App info */}
      <div style={{
        marginTop: 16, background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          About
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 12, lineHeight: 1.6 }}>
          GamerWords v1.0.0<br />
          56 slang terms across 9 languages<br />
          Made for gamers, by gamers
        </div>
      </div>
    </div>
  )
}
