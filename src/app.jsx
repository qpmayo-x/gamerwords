import { useState, useEffect } from 'preact/hooks'
import { Home } from './pages/Home.jsx'
import { Quiz } from './pages/Quiz.jsx'
import { Dictionary } from './pages/Dictionary.jsx'
import { Settings } from './pages/Settings.jsx'
import { NavBar } from './components/NavBar.jsx'
import { applyTheme } from './lib/themes.js'

export function App() {
  const [page, setPage] = useState('home')
  const [learningLang, setLearningLang] = useState(() => {
    return localStorage.getItem('gw_learningLang') || 'ja'
  })
  const [streak, setStreak] = useState(() => {
    return JSON.parse(localStorage.getItem('gw_streak') || '{}')
  })
  const [todayQuizCount, setTodayQuizCount] = useState(() => {
    const today = new Date().toISOString().split('T')[0]
    const data = JSON.parse(localStorage.getItem('gw_usage') || '{}')
    return data.date === today ? data.count : 0
  })
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('gw_theme') || 'midnight'
  })
  const [totalXP, setTotalXP] = useState(() => {
    return parseInt(localStorage.getItem('gw_xp') || '0', 10)
  })
  const [difficulty, setDifficulty] = useState(() => {
    return localStorage.getItem('gw_difficulty') || 'basic'
  })
  const [category, setCategory] = useState(() => {
    return localStorage.getItem('gw_category') || 'all'
  })

  // Apply theme on mount and change
  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem('gw_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('gw_learningLang', learningLang)
  }, [learningLang])

  useEffect(() => {
    localStorage.setItem('gw_difficulty', difficulty)
  }, [difficulty])

  useEffect(() => {
    localStorage.setItem('gw_category', category)
  }, [category])

  const FREE_QUIZ_LIMIT = 5

  function onQuizComplete(score, earnedXP = 0) {
    const today = new Date().toISOString().split('T')[0]
    const newCount = todayQuizCount + 1
    setTodayQuizCount(newCount)
    localStorage.setItem('gw_usage', JSON.stringify({ date: today, count: newCount }))

    // Update streak
    const prev = JSON.parse(localStorage.getItem('gw_streak') || '{}')
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    let current = 1
    let longest = prev.longest || 0

    if (prev.lastDate === today) {
      current = prev.current || 1
    } else if (prev.lastDate === yesterday) {
      current = (prev.current || 0) + 1
    }

    if (current > longest) longest = current
    const streakData = { current, longest, lastDate: today }
    setStreak(streakData)
    localStorage.setItem('gw_streak', JSON.stringify(streakData))

    // Update XP
    const newXP = totalXP + earnedXP
    setTotalXP(newXP)
    localStorage.setItem('gw_xp', String(newXP))

    setPage('home')
  }

  const [reviewMode, setReviewMode] = useState(false)
  const canQuiz = todayQuizCount < FREE_QUIZ_LIMIT

  return (
    <>
      <main style="flex:1;padding:16px;padding-bottom:80px;">
        <div class="page-enter" key={page}>
        {page === 'home' && (
          <Home
            streak={streak}
            todayQuizCount={todayQuizCount}
            freeLimit={FREE_QUIZ_LIMIT}
            learningLang={learningLang}
            setLearningLang={setLearningLang}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            category={category}
            setCategory={setCategory}
            onStartQuiz={() => { setReviewMode(false); canQuiz && setPage('quiz') }}
            onStartReview={() => { setReviewMode(true); canQuiz && setPage('quiz') }}
            canQuiz={canQuiz}
            totalXP={totalXP}
          />
        )}
        {page === 'quiz' && (
          <Quiz
            learningLang={learningLang}
            difficulty={difficulty}
            category={category}
            reviewMode={reviewMode}
            onComplete={onQuizComplete}
            onBack={() => setPage('home')}
            streakDays={streak.current || 0}
          />
        )}
        {page === 'dictionary' && (
          <Dictionary learningLang={learningLang} />
        )}
        {page === 'settings' && (
          <Settings currentTheme={theme} setTheme={setThemeState} />
        )}
        </div>
      </main>
      <NavBar current={page} onNavigate={setPage} />
    </>
  )
}
