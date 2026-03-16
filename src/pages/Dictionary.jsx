import { useState } from 'preact/hooks'
import { SLANG_TERMS, CATEGORIES, LANGUAGES } from '../lib/slang-data.js'
import { t } from '../lib/i18n.js'

export function Dictionary({ learningLang }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(null)
  const T = (key) => t(learningLang, key)

  const filtered = SLANG_TERMS.filter(term => {
    if (search && !term.term.toLowerCase().includes(search.toLowerCase())) return false
    if (category && term.category !== category) return false
    return true
  })

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 16 }}>
        {'\u{1F4D6}'} {T('slangDictionary')}
      </h2>

      {/* Search */}
      <input
        type="text"
        value={search}
        onInput={e => setSearch(e.target.value)}
        placeholder={T('searchSlang')}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--color-border)',
          background: 'var(--color-bg-card)', color: 'var(--color-text-primary)', fontSize: 15, marginBottom: 12,
          outline: 'none',
        }}
      />

      {/* Category filter */}
      <div class="hide-scrollbar" style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        <button
          onClick={() => setCategory(null)}
          style={{
            padding: '8px 14px', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 12, whiteSpace: 'nowrap',
            background: !category ? 'var(--color-accent)' : 'var(--color-border)',
            color: !category ? '#fff' : 'var(--color-text-secondary)',
          }}
        >{T('all')} ({SLANG_TERMS.length})</button>
        {CATEGORIES.map(cat => {
          const count = SLANG_TERMS.filter(t => t.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 14px', borderRadius: 16, border: 'none', cursor: 'pointer',
                fontSize: 12, whiteSpace: 'nowrap', textTransform: 'capitalize',
                background: category === cat ? 'var(--color-accent)' : 'var(--color-border)',
                color: category === cat ? '#fff' : 'var(--color-text-secondary)',
              }}
            >{cat} ({count})</button>
          )
        })}
      </div>

      {/* Term list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(term => (
          <div
            key={term.term}
            class="card-interactive"
            style={{
              background: 'var(--color-bg-card)', borderRadius: 12, padding: '14px 16px',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)' }}>{term.term}</span>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 8,
                background: term.difficulty === 'basic' ? 'rgba(87,242,135,0.15)' : 'rgba(108,99,255,0.15)',
                color: term.difficulty === 'basic' ? 'var(--color-success)' : 'var(--color-accent)',
                textTransform: 'uppercase', fontWeight: 700,
              }}>{term.difficulty}</span>
            </div>
            <div style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>
              {LANGUAGES[learningLang]?.flag} {term.translations[learningLang] || '—'}
            </div>
            {term.example && (
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6, fontStyle: 'italic' }}>
                "{term.example}"
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 32 }}>
            {T('noTermsFound')}
          </div>
        )}
      </div>
    </div>
  )
}
