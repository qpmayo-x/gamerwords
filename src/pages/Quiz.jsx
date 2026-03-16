import { useState, useEffect } from 'preact/hooks'
import { SLANG_TERMS, getTermsByDifficulty, getTermsByCategory } from '../lib/slang-data.js'
import { generateMixedQuiz, calculateScore } from '../lib/quiz-engine.js'
import { calculateXP } from '../lib/xp-system.js'
import { FillBlank } from '../components/FillBlank.jsx'
import { MatchPairs } from '../components/MatchPairs.jsx'
import { playCorrect, playWrong } from '../lib/feedback.js'
import { t } from '../lib/i18n.js'

export function Quiz({ learningLang, difficulty, category, reviewMode, onComplete, onBack, streakDays }) {
  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [xpAnimating, setXpAnimating] = useState(false)

  useEffect(() => {
    let terms
    if (reviewMode) {
      const missed = JSON.parse(localStorage.getItem('gw_missed') || '[]')
      terms = SLANG_TERMS.filter(t => missed.includes(t.term))
    } else {
      terms = difficulty === 'mixed' ? getTermsByDifficulty(null) : getTermsByDifficulty(difficulty)
      if (category && category !== 'all') {
        terms = terms.filter(t => t.category === category)
      }
    }
    // Need at least 4 terms for quiz generation
    if (terms.length < 4) {
      terms = difficulty === 'mixed' ? getTermsByDifficulty(null) : getTermsByDifficulty(difficulty)
    }
    const q = generateMixedQuiz(terms, learningLang, 10)
    setQuestions(q)
  }, [learningLang, difficulty, category, reviewMode])

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div class="spinner" />
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 16, fontSize: 14 }}>{t(learningLang, 'loading')}</p>
      </div>
    )
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
          {score.percentage >= 80 ? t(learningLang, 'amazing') :
           score.percentage >= 50 ? t(learningLang, 'goodJob') :
           t(learningLang, 'dontGiveUp')}
        </p>
        <button
          onClick={() => onComplete(score, earnedXP)}
          style={{
            padding: '14px 32px', borderRadius: 12, border: 'none',
            background: 'var(--color-accent)', color: '#fff', fontSize: 16,
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          {t(learningLang, 'done')}
        </button>
      </div>
    )
  }

  const q = questions[currentIdx]

  function advance(isCorrect) {
    if (isCorrect) playCorrect()
    else playWrong()
    const termName = q.type === 'match_pairs' ? null : (q.type === 'reverse' ? q.correctAnswer : q.question)
    setAnswers(prev => [...prev, { question: q.question || 'match', selected: null, correct: null, isCorrect, term: termName }])

    // Save missed terms for review
    if (!isCorrect && termName) {
      const missed = JSON.parse(localStorage.getItem('gw_missed') || '[]')
      if (!missed.includes(termName)) {
        missed.push(termName)
        localStorage.setItem('gw_missed', JSON.stringify(missed))
      }
    }
    // Remove from missed if answered correctly
    if (isCorrect && termName) {
      const missed = JSON.parse(localStorage.getItem('gw_missed') || '[]')
      const filtered = missed.filter(t => t !== termName)
      localStorage.setItem('gw_missed', JSON.stringify(filtered))
    }

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
        <div class="page-enter" key={currentIdx}>
          <FillBlank question={q} lang={learningLang} onAnswer={(isCorrect) => advance(isCorrect)} />
        </div>
      </div>
    )
  }

  // Match pairs handler
  if (q.type === 'match_pairs') {
    return (
      <div>
        {renderProgressBar()}
        <div class="page-enter" key={currentIdx}>
        <MatchPairs question={q} lang={learningLang} onAnswer={(correctCount) => {
          const isCorrect = correctCount === q.pairs.length
          advance(isCorrect)
        }} />
        </div>
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
          fontSize: 20, cursor: 'pointer', padding: 8, minWidth: 40, minHeight: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{'\u2190'}</button>
        <div style={{ flex: 1, height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${((currentIdx) / questions.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-accent), #a855f7)',
            boxShadow: '0 0 8px rgba(108, 99, 255, 0.4)',
            borderRadius: 4,
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
      <div class="page-enter" key={currentIdx}>

      {/* Question */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 8 }}>
          {isReverse ? t(learningLang, 'whichTermMeans') : t(learningLang, 'whatDoesMean')}
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
          const answerClass = showResult && option === q.correctAnswer ? 'answer-correct quiz-option' :
            showResult && option === selected && option !== q.correctAnswer ? 'answer-wrong quiz-option' : 'quiz-option'
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
    </div>
  )
}
