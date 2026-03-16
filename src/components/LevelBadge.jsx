import { getLevelFromXP } from '../lib/xp-system.js'

export function LevelBadge({ totalXP }) {
  const info = getLevelFromXP(totalXP)

  return (
    <div style={{
      background: 'var(--color-bg-card)', borderRadius: 16, padding: 16,
      marginBottom: 16, border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 18, fontWeight: 800, color: 'var(--color-accent)',
          }}>
            Lv.{info.level}
          </span>
          <span style={{
            fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)',
          }}>
            {info.title}
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {totalXP} XP
        </span>
      </div>

      {/* XP progress bar */}
      <div style={{
        height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden',
      }}>
        <div style={{
          width: `${info.progress * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--color-accent), #a855f7)',
          borderRadius: 4,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {info.nextLevelXP !== null && (
        <div style={{
          fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6, textAlign: 'right',
        }}>
          {info.currentXP} / {info.nextLevelXP} XP to next level
        </div>
      )}
    </div>
  )
}
