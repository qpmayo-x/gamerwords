import { useState, useEffect, useRef } from 'preact/hooks'
import { t } from '../lib/i18n.js'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MatchPairs({ question, lang, onAnswer }) {
  const [shuffledTranslations, setShuffledTranslations] = useState([])
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [selectedTranslation, setSelectedTranslation] = useState(null)
  const [matched, setMatched] = useState([]) // indices of matched pairs
  const [wrongFlash, setWrongFlash] = useState(false)
  const correctCount = useRef(0)

  useEffect(() => {
    setShuffledTranslations(shuffleArray(question.pairs.map(p => p.translation)))
  }, [question])

  useEffect(() => {
    if (selectedTerm !== null && selectedTranslation !== null) {
      const pair = question.pairs[selectedTerm]
      const isCorrect = pair.translation === selectedTranslation

      if (isCorrect) {
        correctCount.current += 1
        const newMatched = [...matched, selectedTerm]
        setMatched(newMatched)
        setSelectedTerm(null)
        setSelectedTranslation(null)

        if (newMatched.length === question.pairs.length) {
          setTimeout(() => {
            onAnswer(correctCount.current)
          }, 600)
        }
      } else {
        setWrongFlash(true)
        setTimeout(() => {
          setSelectedTerm(null)
          setSelectedTranslation(null)
          setWrongFlash(false)
        }, 500)
      }
    }
  }, [selectedTerm, selectedTranslation])

  const isTermMatched = (idx) => matched.includes(idx)
  const isTranslationMatched = (trans) => {
    return matched.some(idx => question.pairs[idx].translation === trans)
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 8 }}>
          {t(lang, 'matchPairs')}
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
          {t(lang, 'tapToMatch')}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {/* Terms column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {question.pairs.map((pair, idx) => {
            const isMatched = isTermMatched(idx)
            const isSelected = selectedTerm === idx
            return (
              <button
                key={idx}
                onClick={() => {
                  if (isMatched) return
                  setSelectedTerm(idx)
                }}
                style={{
                  padding: 14, borderRadius: 10,
                  border: `2px solid ${isMatched ? 'var(--color-success)' : isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isMatched ? 'rgba(87,242,135,0.1)' : 'var(--color-bg-card)',
                  color: isMatched ? 'var(--color-success)' : 'var(--color-text-primary)',
                  fontSize: 15, fontWeight: 600,
                  cursor: isMatched ? 'default' : 'pointer',
                  textAlign: 'center', transition: 'all 0.2s',
                  opacity: isMatched ? 0.6 : 1,
                }}
              >
                {isMatched ? '\u2713 ' : ''}{pair.term}
              </button>
            )
          })}
        </div>

        {/* Translations column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shuffledTranslations.map((trans, idx) => {
            const isMatched = isTranslationMatched(trans)
            const isSelected = selectedTranslation === trans
            const isWrong = wrongFlash && isSelected
            return (
              <button
                key={idx}
                onClick={() => {
                  if (isMatched) return
                  setSelectedTranslation(trans)
                }}
                style={{
                  padding: 14, borderRadius: 10,
                  border: `2px solid ${isMatched ? 'var(--color-success)' : isWrong ? 'var(--color-error)' : isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  background: isMatched ? 'rgba(87,242,135,0.1)' : isWrong ? 'rgba(237,66,69,0.15)' : 'var(--color-bg-card)',
                  color: isMatched ? 'var(--color-success)' : 'var(--color-text-primary)',
                  fontSize: 15, fontWeight: 600,
                  cursor: isMatched ? 'default' : 'pointer',
                  textAlign: 'center', transition: 'all 0.2s',
                  opacity: isMatched ? 0.6 : 1,
                }}
              >
                {isMatched ? '\u2713 ' : ''}{trans}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
