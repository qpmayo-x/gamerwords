import { useState } from 'preact/hooks'
import { t } from '../lib/i18n.js'

export function FillBlank({ question, lang, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  function handleSelect(option) {
    if (selected !== null) return
    setSelected(option)
    setShowResult(true)
    const isCorrect = option === question.correctAnswer

    setTimeout(() => {
      onAnswer(isCorrect)
    }, 1000)
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 12 }}>
          {t(lang, 'fillBlank')}
        </p>

        {/* Translation as main hint */}
        {question.hint && (
          <div style={{
            fontSize: 24, fontWeight: 800, color: 'var(--color-accent)',
            marginBottom: 16,
          }}>
            {question.hint}
          </div>
        )}

        {/* Usage note */}
        {question.usageNote && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
            {question.usageNote}
          </p>
        )}

        {/* English sentence with blank */}
        <div style={{
          background: 'var(--color-bg-card)', borderRadius: 12, padding: 16,
          border: '1px solid var(--color-border)',
        }}>
          <p style={{
            fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)',
            lineHeight: 1.6,
          }}>
            {question.question.split('___').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span style={{
                    display: 'inline-block',
                    minWidth: 70,
                    borderBottom: '3px solid var(--color-accent)',
                    color: showResult ? 'var(--color-success)' : 'var(--color-accent)',
                    fontWeight: 800,
                    padding: '0 4px',
                    margin: '0 4px',
                  }}>
                    {showResult ? question.correctAnswer : '\u00A0\u00A0\u00A0'}
                  </span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {question.options.map((option, i) => {
          let bg = 'var(--color-bg-card)'
          let border = 'var(--color-border)'
          if (showResult) {
            if (option === question.correctAnswer) { bg = 'rgba(87,242,135,0.15)'; border = 'var(--color-success)' }
            else if (option === selected) { bg = 'rgba(237,66,69,0.15)'; border = 'var(--color-error)' }
          }
          const answerClass = showResult && option === question.correctAnswer ? 'answer-correct quiz-option' :
            showResult && option === selected && option !== question.correctAnswer ? 'answer-wrong quiz-option' : 'quiz-option'
          return (
            <button
              key={i}
              class={answerClass}
              onClick={() => handleSelect(option)}
              style={{
                padding: 16, borderRadius: 12, border: `2px solid ${border}`,
                background: bg, color: 'var(--color-text-primary)', fontSize: 16,
                cursor: selected !== null ? 'default' : 'pointer',
                textAlign: 'left', transition: 'all 0.2s',
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
