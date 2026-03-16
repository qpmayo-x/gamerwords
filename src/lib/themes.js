export const THEMES = {
  midnight: {
    name: 'Midnight',
    emoji: '\u{1F30C}',
    bgPrimary: '#0f0f23',
    bgSecondary: '#1a1a3e',
    bgCard: '#1e1e3a',
    accent: '#6c63ff',
    accentHover: '#5a52e0',
    success: '#57f287',
    error: '#ed4245',
    warning: '#fee75c',
    textPrimary: '#ffffff',
    textSecondary: '#b8b8d0',
    textMuted: '#666680',
    border: '#2a2a5a',
  },
  cyberpunk: {
    name: 'Cyberpunk',
    emoji: '\u{1F916}',
    bgPrimary: '#0a0a0f',
    bgSecondary: '#12121f',
    bgCard: '#1a1a2a',
    accent: '#00ff88',
    accentHover: '#00cc6e',
    success: '#00ff88',
    error: '#ff2266',
    warning: '#ffaa00',
    textPrimary: '#e0ffe0',
    textSecondary: '#88aa99',
    textMuted: '#445555',
    border: '#1a3a2a',
  },
  sakura: {
    name: 'Sakura',
    emoji: '\u{1F338}',
    bgPrimary: '#1a0f1e',
    bgSecondary: '#2a1832',
    bgCard: '#301a38',
    accent: '#ff69b4',
    accentHover: '#e0559d',
    success: '#7cfc00',
    error: '#ff4444',
    warning: '#ffd700',
    textPrimary: '#fff0f5',
    textSecondary: '#cc99bb',
    textMuted: '#775577',
    border: '#442244',
  },
  ocean: {
    name: 'Ocean',
    emoji: '\u{1F30A}',
    bgPrimary: '#0a1628',
    bgSecondary: '#0f2040',
    bgCard: '#142850',
    accent: '#00b4d8',
    accentHover: '#0096b7',
    success: '#2ec4b6',
    error: '#e71d36',
    warning: '#ff9f1c',
    textPrimary: '#e0f0ff',
    textSecondary: '#8ab4d0',
    textMuted: '#4a6a80',
    border: '#1a3a5a',
  },
  fire: {
    name: 'Fire',
    emoji: '\u{1F525}',
    bgPrimary: '#1a0a0a',
    bgSecondary: '#2a1010',
    bgCard: '#351515',
    accent: '#ff6b35',
    accentHover: '#e55a28',
    success: '#44cc44',
    error: '#ff3333',
    warning: '#ffcc00',
    textPrimary: '#ffe8e0',
    textSecondary: '#cc9988',
    textMuted: '#775544',
    border: '#4a2020',
  },
  forest: {
    name: 'Forest',
    emoji: '\u{1F332}',
    bgPrimary: '#0a140a',
    bgSecondary: '#102010',
    bgCard: '#152815',
    accent: '#4ade80',
    accentHover: '#3cc06a',
    success: '#4ade80',
    error: '#f87171',
    warning: '#fbbf24',
    textPrimary: '#e8ffe8',
    textSecondary: '#88bb88',
    textMuted: '#446644',
    border: '#1a3a1a',
  },
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.midnight
  const root = document.documentElement
  root.style.setProperty('--color-bg-primary', theme.bgPrimary)
  root.style.setProperty('--color-bg-secondary', theme.bgSecondary)
  root.style.setProperty('--color-bg-card', theme.bgCard)
  root.style.setProperty('--color-accent', theme.accent)
  root.style.setProperty('--color-accent-hover', theme.accentHover)
  root.style.setProperty('--color-success', theme.success)
  root.style.setProperty('--color-error', theme.error)
  root.style.setProperty('--color-warning', theme.warning)
  root.style.setProperty('--color-text-primary', theme.textPrimary)
  root.style.setProperty('--color-text-secondary', theme.textSecondary)
  root.style.setProperty('--color-text-muted', theme.textMuted)
  root.style.setProperty('--color-border', theme.border)
  document.body.style.background = theme.bgPrimary
  document.body.style.color = theme.textPrimary
}
