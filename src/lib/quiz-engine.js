// Quiz question generation engine

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n)
}

// Pick N unique values from a pool, avoiding duplicates with existing set
function pickUniqueAnswers(pool, key, count, exclude) {
  const seen = new Set(exclude)
  const result = []
  const shuffled = shuffle(pool)
  for (const item of shuffled) {
    const val = typeof key === 'function' ? key(item) : item[key]
    if (!seen.has(val)) {
      seen.add(val)
      result.push(val)
      if (result.length >= count) break
    }
  }
  return result
}

// Generate multiple choice questions
// "What does [term] mean in [targetLang]?"
export function generateMultipleChoice(terms, targetLang, count = 10) {
  const available = terms.filter(t => t.translations[targetLang])
  if (available.length < 4) return []

  const selected = pickRandom(available, Math.min(count, available.length))

  return selected.map(term => {
    const correctAnswer = term.translations[targetLang]
    const wrongPool = available.filter(t => t.term !== term.term)
    const wrongAnswers = pickUniqueAnswers(wrongPool, t => t.translations[targetLang], 3, [correctAnswer])
    const options = shuffle([correctAnswer, ...wrongAnswers])

    return {
      type: 'multiple_choice',
      question: term.term,
      questionContext: term.example || '',
      correctAnswer,
      options,
      category: term.category,
    }
  })
}

// Generate reverse questions
// "Which English term means [translation]?"
export function generateReverse(terms, targetLang, count = 10) {
  const available = terms.filter(t => t.translations[targetLang])
  if (available.length < 4) return []

  const selected = pickRandom(available, Math.min(count, available.length))

  return selected.map(term => {
    const correctAnswer = term.term
    const wrongPool = available.filter(t => t.term !== term.term)
    const wrongAnswers = pickUniqueAnswers(wrongPool, 'term', 3, [correctAnswer])
    const options = shuffle([correctAnswer, ...wrongAnswers])

    return {
      type: 'reverse',
      question: term.translations[targetLang],
      questionContext: '',
      correctAnswer,
      options,
      category: term.category,
    }
  })
}

// Generate fill-in-the-blank questions
// Shows an example sentence with the slang term blanked out
export function generateFillBlank(terms, targetLang, count = 5) {
  const available = terms.filter(t => t.translations[targetLang] && t.example)
  if (available.length < 4) return []

  const selected = pickRandom(available, Math.min(count, available.length))

  return selected.map(term => {
    const correctAnswer = term.term
    const sentence = term.example.replace(new RegExp(term.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '___')
    const wrongPool = available.filter(t => t.term !== term.term)
    const wrongAnswers = pickUniqueAnswers(wrongPool, 'term', 3, [correctAnswer])
    const options = shuffle([correctAnswer, ...wrongAnswers])

    return {
      type: 'fill_blank',
      question: sentence,
      correctAnswer,
      hint: term.translations[targetLang],
      usageNote: term.usageNote || '',
      options,
      category: term.category,
    }
  })
}

// Generate match-pairs questions
// Returns 5 term-translation pairs to match
export function generateMatchPairs(terms, targetLang, count = 2) {
  const available = terms.filter(t => t.translations[targetLang])
  if (available.length < 5) return []

  const sets = []
  for (let i = 0; i < count; i++) {
    // Pick 5 terms with unique translations to avoid ambiguous matches
    const shuffled = shuffle(available)
    const selected = []
    const usedTranslations = new Set()
    for (const term of shuffled) {
      const trans = term.translations[targetLang]
      if (!usedTranslations.has(trans)) {
        usedTranslations.add(trans)
        selected.push(term)
        if (selected.length >= 5) break
      }
    }
    if (selected.length < 5) continue
    const pairs = selected.map(term => ({
      term: term.term,
      translation: term.translations[targetLang],
    }))
    sets.push({
      type: 'match_pairs',
      pairs,
      category: 'mixed',
    })
  }
  return sets
}

// Generate a mixed quiz (all 4 types)
export function generateMixedQuiz(terms, targetLang, count = 10) {
  const mc = generateMultipleChoice(terms, targetLang, 3)
  const rev = generateReverse(terms, targetLang, 3)
  const fb = generateFillBlank(terms, targetLang, 2)
  const mp = generateMatchPairs(terms, targetLang, 2)
  return shuffle([...mc, ...rev, ...fb, ...mp])
}

// Calculate score
export function calculateScore(answers) {
  const correct = answers.filter(a => a.isCorrect).length
  return { correct, total: answers.length, percentage: Math.round((correct / answers.length) * 100) }
}
