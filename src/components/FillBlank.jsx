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
    }, 1200)
  }

  // Highlight the target term in the example sentence
  const termRegex = new RegExp(`(${question.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i')
  const parts = question.question.split(termRegex)

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        {/* Instruction */}
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 16 }}>
          {t(lang, 'whatDoesMean')}
        </p>

        {/* The target term, large */}
        <div style={{
          fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)',
          marginBottom: 16,
        }}>
          {question.term}
        </div>

        {/* Example sentence with term highlighted */}
        <div style={{
          background: 'var(--color-bg-card)', borderRadius: 12, padding: 16,
          border: '1px solid var(--color-border)',
        }}>
          <p style={{
            fontSize: 14, color: 'var(--color-text-secondary)',
            lineHeight: 1.6, fontStyle: 'italic',
          }}>
            "{parts.map((part, i) =>
              termRegex.test(part)
                ? <span key={i} style={{ color: 'var(--color-accent)', fontWeight: 700, fontStyle: 'normal' }}>{part}</span>
                : <span key={i}>{part}</span>
            )}"
          </p>
          {lang === 'ja' && question.exampleJa && (
            <p style={{
              fontSize: 13, color: 'var(--color-text-muted)',
              marginTop: 8, lineHeight: 1.5,
            }}>
              {question.exampleJa}
            </p>
          )}
        </div>
      </div>

      {/* Options — target language translations */}
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
