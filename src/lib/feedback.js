// Sound + haptic feedback for quiz answers

const AudioCtx = window.AudioContext || window.webkitAudioContext

function playTone(freq, duration, type = 'sine') {
  try {
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = 0.15
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (e) {}
}

export function playCorrect() {
  playTone(523, 0.1) // C5
  setTimeout(() => playTone(659, 0.1), 80) // E5
  setTimeout(() => playTone(784, 0.15), 160) // G5
  vibrate(30)
}

export function playWrong() {
  playTone(200, 0.2, 'square')
  setTimeout(() => playTone(150, 0.3, 'square'), 150)
  vibrate([50, 30, 50])
}

function vibrate(pattern) {
  try {
    navigator.vibrate?.(pattern)
  } catch (e) {}
}
