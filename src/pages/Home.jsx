import { LANGUAGES } from '../lib/slang-data.js'
import { LevelBadge } from '../components/LevelBadge.jsx'

const DIFFICULTIES = [
  { id: 'basic', label: 'Basic', desc: '163 terms', emoji: '\u{1F331}' },
  { id: 'advanced', label: 'Advanced', desc: '110 terms', emoji: '\u{1F525}' },
  { id: 'mixed', label: 'Mixed', desc: 'All 273 terms', emoji: '\u{1F300}' },
]

export function Home({ streak, todayQuizCount, freeLimit, learningLang, setLearningLang, difficulty, setDifficulty, onStartQuiz, canQuiz, totalXP }) {
  const remaining = freeLimit - todayQuizCount

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-accent)', margin: '8px 0 4px' }}>
          GamerWords
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Learn gaming slang in any language</p>
      </div>

      {/* Level Badge */}
      <LevelBadge totalXP={totalXP} />

      {/* Streak */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 20,
        textAlign: 'center', marginBottom: 16, border: '1px solid var(--color-border)',
      }}>
        <div style={{ fontSize: 48 }}>{streak.current > 0 ? '\u{1F525}' : '\u{2744}\u{FE0F}'}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {streak.current || 0}
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          {streak.current > 0 ? 'Day Streak' : 'Start your streak!'}
        </div>
        {streak.longest > 0 && (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginTop: 4 }}>
            Best: {streak.longest} days
          </div>
        )}
      </div>

      {/* Language Picker */}
      <div style={{
        background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
        marginBottom: 16, border: '1px solid var(--color-border)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 8 }}>I'm learning:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.entries(LANGUAGES).filter(([code]) => code !== 'en').map(([code, lang]) => (
            <button
              key={code}
              onClick={() => setLearningLang(code)}
              style={{
                padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
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
        marginBottom: 16, border: '1px solid var(--color-border)',
      }}>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginBottom: 8 }}>Difficulty:</div>
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

      {/* Start Quiz */}
      <button
        onClick={onStartQuiz}
        disabled={!canQuiz}
        style={{
          width: '100%', padding: 16, borderRadius: 12, border: 'none',
          background: canQuiz ? 'var(--color-accent)' : 'var(--color-border)',
          color: canQuiz ? '#fff' : 'var(--color-text-muted)',
          fontSize: 18, fontWeight: 700, cursor: canQuiz ? 'pointer' : 'default',
          marginBottom: 12,
        }}
      >
        {canQuiz ? '\u{1F3AF} Start Quiz' : 'Daily Limit Reached'}
      </button>

      {/* Remaining */}
      <div style={{ textAlign: 'center', color: remaining <= 2 ? 'var(--color-error)' : 'var(--color-text-secondary)', fontSize: 13 }}>
        {remaining} / {freeLimit} quizzes remaining today
        {!canQuiz && (
          <div style={{ marginTop: 8 }}>
            <button style={{
              background: `linear-gradient(135deg, var(--color-accent), #a855f7)`,
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              Upgrade to Pro — Unlimited
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
