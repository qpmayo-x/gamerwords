import { LANGUAGES, CATEGORIES } from '../lib/slang-data.js'
import { LevelBadge } from '../components/LevelBadge.jsx'
import { t } from '../lib/i18n.js'

const DIFFICULTIES = [
  { id: 'basic', label: 'Basic', desc: '163', emoji: '\u{1F331}' },
  { id: 'advanced', label: 'Advanced', desc: '110', emoji: '\u{1F525}' },
  { id: 'mixed', label: 'Mixed', desc: '273', emoji: '\u{1F300}' },
]

const CATEGORY_LABELS = {
  all: { emoji: '\u{1F30D}' },
  general: { label: 'General', emoji: '\u{1F3AE}' },
  fps: { label: 'FPS', emoji: '\u{1F52B}' },
  moba: { label: 'MOBA', emoji: '\u{1F5E1}\u{FE0F}' },
  mmo: { label: 'MMO', emoji: '\u{1F30D}' },
  battleroyale: { label: 'BR', emoji: '\u{1F4A5}' },
  fighting: { label: 'Fighting', emoji: '\u{1F94A}' },
  social: { label: 'Social', emoji: '\u{1F4AC}' },
  attitude: { label: 'Attitude', emoji: '\u{1F608}' },
  technical: { label: 'Tech', emoji: '\u{2699}\u{FE0F}' },
  economy: { label: 'Economy', emoji: '\u{1F4B0}' },
  speedrun: { label: 'Speedrun', emoji: '\u{23F1}\u{FE0F}' },
  strategy: { label: 'Strategy', emoji: '\u{1F9E0}' },
}

export function Home({ streak, todayQuizCount, freeLimit, learningLang, setLearningLang, difficulty, setDifficulty, category, setCategory, onStartQuiz, onStartReview, canQuiz, totalXP }) {
  const remaining = freeLimit - todayQuizCount
  const missedCount = JSON.parse(localStorage.getItem('gw_missed') || '[]').length
  const T = (key) => t(learningLang, key)

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-accent)', margin: '8px 0 4px' }}>
          {T('appTitle')}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>{T('appSubtitle')}</p>
      </div>

      {/* Level Badge */}
      <LevelBadge totalXP={totalXP} lang={learningLang} />

      {/* Streak */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 20,
        textAlign: 'center', marginBottom: 16, border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <div class={streak.current > 0 ? 'fire-flicker' : ''} style={{ fontSize: 48 }}>{streak.current > 0 ? '\u{1F525}' : '\u{2744}\u{FE0F}'}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {streak.current || 0}
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          {streak.current > 0 ? T('dayStreak') : T('startStreak')}
        </div>
        {streak.longest > 0 && (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 4 }}>
            {T('best')}: {streak.longest} {T('days')}
          </div>
        )}
      </div>

      {/* Language Picker */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        marginBottom: 16, border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 8 }}>{T('imLearning')}</div>
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

      {/* Difficulty Picker */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        marginBottom: 16, border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 8 }}>{T('difficulty')}:</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {DIFFICULTIES.map(d => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: d.id === difficulty ? 'var(--color-accent)' : 'var(--color-border)',
                color: d.id === difficulty ? '#fff' : 'var(--color-text-secondary)',
                textAlign: 'center', transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 20 }}>{d.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: d.id === difficulty ? 700 : 400 }}>{d.label}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Picker */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        marginBottom: 16, border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 8 }}>{T('category')}:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['all', ...CATEGORIES].map(cat => {
            const info = CATEGORY_LABELS[cat] || { label: cat, emoji: '' }
            const active = cat === category
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: active ? 700 : 400,
                  background: active ? 'var(--color-accent)' : 'var(--color-border)',
                  color: active ? '#fff' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                {info.emoji} {cat === 'all' ? T('all') : info.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Start Quiz */}
      <button
        onClick={onStartQuiz}
        disabled={!canQuiz}
        class={canQuiz ? 'cta-pulse' : ''}
        style={{
          width: '100%', padding: 16, borderRadius: 12, border: 'none',
          background: canQuiz ? 'linear-gradient(135deg, var(--color-accent), #a855f7)' : 'var(--color-border)',
          color: canQuiz ? '#fff' : 'var(--color-text-muted)',
          fontSize: 18, fontWeight: 700, cursor: canQuiz ? 'pointer' : 'default',
          marginBottom: 12,
        }}
      >
        {canQuiz ? `\u{1F3AF} ${T('startQuiz')}` : T('dailyLimitReached')}
      </button>

      {/* Review Mode */}
      {missedCount >= 4 && canQuiz && (
        <button
          onClick={onStartReview}
          style={{
            width: '100%', padding: 14, borderRadius: 12, border: '2px solid var(--color-warning)',
            background: 'transparent', color: 'var(--color-warning)',
            fontSize: 16, fontWeight: 700, cursor: 'pointer', marginBottom: 12,
          }}
        >
          {'\u{1F504}'} {T('reviewMistakes')} ({missedCount})
        </button>
      )}

      {/* Remaining */}
      <div style={{ textAlign: 'center', color: remaining <= 2 ? 'var(--color-error)' : 'var(--color-text-secondary)', fontSize: 13 }}>
        {remaining} / {freeLimit} {T('quizzesRemaining')}
        {!canQuiz && (
          <div style={{ marginTop: 8 }}>
            <button style={{
              background: `linear-gradient(135deg, var(--color-accent), #a855f7)`,
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              {T('upgradePro')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
