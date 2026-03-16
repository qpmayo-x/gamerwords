import { useState, useEffect } from 'preact/hooks'
import { SLANG_TERMS, getTermsByDifficulty } from '../lib/slang-data.js'
import { generateMixedQuiz, calculateScore } from '../lib/quiz-engine.js'
import { calculateXP } from '../lib/xp-system.js'
import { FillBlank } from '../components/FillBlank.jsx'
import { MatchPairs } from '../components/MatchPairs.jsx'

export function Quiz({ learningLang, difficulty, onComplete, onBack, streakDays }) {
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [xpAnimating, setXpAnimating] = useState(false)

  useEffect(() => {
    const terms = difficulty === 'mixed' ? getTermsByDifficulty(null) : getTermsByDifficulty(difficulty)
    const q = generateMixedQuiz(terms, learningLang, 10)
    setQuestions(q)
  }, [learningLang, difficulty])

  if (questions.length === 0) {
    return <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: 40 }}>Loading...</div>
  }

  if (finished) {
    const score = calculateScore(answers)
    return (
      <div style={{ textAlign: 'center', paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>
          {score.percentage >= 80 ? '\u{1F389}' : score.percentage >= 50 ? '\u{1F44D}' : '\u{1F4AA}'}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: 8 }}>
          {score.correct} / {score.total}
        </h2>
        <div style={{
          fontSize: 40, fontWeight: 800, marginBottom: 16,
          color: score.percentage >= 80 ? 'var(--color-success)' : score.percentage >= 50 ? 'var(--color-warning)' : 'var(--color-error)',
        }}>
          {score.percentage}%
        </div>

        {/* XP earned */}
        <div style={{
          fontSize: 20, fontWeight: 700, color: 'var(--color-accent)',
          marginBottom: 16,
          opacity: xpAnimating ? 1 : 0,
          transform: xpAnimating ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
          transition: 'all 0.5s ease',
        }}>
          +{earnedXP} XP
        </div>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24 }}>
          {score.percentage >= 80 ? 'Amazing! You speak gamer!' :
           score.percentage >= 50 ? 'Good job! Keep practicing!' :
           "Don't give up! Try again!"}
        </p>
        <button
          onClick={() => onComplete(score, earnedXP)}
          style={{
            padding: '14px 32px', borderRadius: 12, border: 'none',
            background: 'var(--color-accent)', color: '#fff', fontSize: 16,
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          Done
        </button>
      </div>
    )
  }

  const q = questions[currentIdx]

  function advance(isCorrect) {
    setAnswers(prev => [...prev, { question: q.question || 'match', selected: null, correct: null, isCorrect }])
    if (currentIdx + 1 >= questions.length) {
      // Calculate XP
      const allAnswers = [...answers, { isCorrect }]
      const correctCount = allAnswers.filter(a => a.isCorrect).length
      const xp = calculateXP(correctCount, allAnswers.length, streakDays || 0)
      setEarnedXP(xp)
      setFinished(true)
      setTimeout(() => setXpAnimating(true), 200)
    } else {
      setCurrentIdx(prev => prev + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  // Fill blank handler
  if (q.type === 'fill_blank') {
    return (
      <div>
        {renderProgressBar()}
        <FillBlank question={q} onAnswer={(isCorrect) => advance(isCorrect)} />
      </div>
    )
  }

  // Match pairs handler
  if (q.type === 'match_pairs') {
    return (
      <div>
        {renderProgressBar()}
        <MatchPairs question={q} onAnswer={(correctCount) => {
          const isCorrect = correctCount === q.pairs.length
          advance(isCorrect)
        }} />
      </div>
    )
  }

  // Multiple choice / reverse handler
  function handleSelect(option) {
    if (selected !== null) return
    setSelected(option)
    setShowResult(true)
    const isCorrect = option === q.correctAnswer

    setTimeout(() => {
      advance(isCorrect)
    }, 1000)
  }

  function renderProgressBar() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--color-text-secondary)',
          fontSize: 20, cursor: 'pointer', padding: 0,
        }}>{'\u2190'}</button>
        <div style={{ flex: 1, height: 8, background: 'var(--color-border)', borderRadius: 4 }}>
          <div style={{
            width: `${((currentIdx) / questions.length) * 100}%`,
            height: '100%', background: 'var(--color-accent)', borderRadius: 4,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{currentIdx + 1}/{questions.length}</span>
      </div>
    )
  }

  const isReverse = q.type === 'reverse'

  return (
    <div>
      {renderProgressBar()}

      {/* Question */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 8 }}>
          {isReverse ? 'Which English term means...' : 'What does this mean?'}
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {q.question}
        </h2>
        {q.questionContext && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>
            "{q.questionContext}"
          </p>
        )}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {q.options.map((option, i) => {
          let bg = 'var(--color-bg-card)'
          let border = 'var(--color-border)'
          if (showResult) {
            if (option === q.correctAnswer) { bg = 'rgba(87,242,135,0.15)'; border = 'var(--color-success)' }
            else if (option === selected) { bg = 'rgba(237,66,69,0.15)'; border = 'var(--color-error)' }
          }
          return (
            <button
              key={i}
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
