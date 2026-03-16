import { THEMES } from '../lib/themes.js'
import { LANGUAGES } from '../lib/slang-data.js'
import { t } from '../lib/i18n.js'

export function Settings({ currentTheme, setTheme, learningLang, setLearningLang }) {
  const T = (key) => t(learningLang, key)

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 24 }}>
        {'\u{2699}\u{FE0F}'} {T('settings')}
      </h2>

      {/* Language picker */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        marginBottom: 16,
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
          {T('learningLanguage')}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(LANGUAGES).filter(([code]) => code !== 'en').map(([code, lang]) => (
            <button
              key={code}
              onClick={() => setLearningLang(code)}
              style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: code === learningLang ? 700 : 400,
                background: code === learningLang ? 'var(--color-accent)' : 'var(--color-border)',
                color: code === learningLang ? '#fff' : 'var(--color-text-secondary)',
              }}
            >
              {lang.flag} {lang.native}
            </button>
          ))}
        </div>
      </div>

      {/* Theme picker */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        border: '1px solid var(--color-border)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
          {T('theme')}
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
          {T('about')}
        </div>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 12, lineHeight: 1.6 }}>
          GamerWords v1.1.0<br />
          {T('termsAcross')}<br />
          {T('madeFor')}
        </div>
      </div>
    </div>
  )
}
