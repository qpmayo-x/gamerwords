// XP rewards
const XP_CORRECT_ANSWER = 10
const XP_PERFECT_QUIZ = 50  // bonus for 100%
const XP_STREAK_BONUS = 5   // per streak day
const XP_QUIZ_COMPLETE = 20

// Level thresholds (XP needed for each level)
export const LEVELS = [
  { level: 1, xp: 0, title: 'Noob' },
  { level: 2, xp: 100, title: 'Casual' },
  { level: 3, xp: 300, title: 'Regular' },
  { level: 4, xp: 600, title: 'Tryhard' },
  { level: 5, xp: 1000, title: 'Veteran' },
  { level: 6, xp: 1500, title: 'Cracked' },
  { level: 7, xp: 2500, title: 'Goated' },
  { level: 8, xp: 4000, title: 'Pro' },
  { level: 9, xp: 6000, title: 'Legend' },
  { level: 10, xp: 10000, title: 'God Gamer' },
]

export function calculateXP(correctCount, totalCount, streakDays) {
  let xp = correctCount * XP_CORRECT_ANSWER
  xp += XP_QUIZ_COMPLETE
  if (correctCount === totalCount && totalCount > 0) {
    xp += XP_PERFECT_QUIZ
  }
  if (streakDays > 0) {
    xp += streakDays * XP_STREAK_BONUS
  }
  return xp
}

export function getLevelFromXP(totalXP) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.xp) {
      current = lvl
    } else {
      break
    }
  }
  const nextLevel = LEVELS.find(l => l.level === current.level + 1)
  const nextLevelXP = nextLevel ? nextLevel.xp : null
  const currentLevelXP = current.xp
  const progress = nextLevelXP !== null
    ? (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)
    : 1

  return {
    level: current.level,
    title: current.title,
    currentXP: totalXP - currentLevelXP,
    nextLevelXP: nextLevelXP !== null ? nextLevelXP - currentLevelXP : null,
    progress: Math.min(1, Math.max(0, progress)),
  }
}

export function getXPToNextLevel(totalXP) {
  const nextLevel = LEVELS.find(l => l.xp > totalXP)
  if (!nextLevel) return 0
  return nextLevel.xp - totalXP
}
