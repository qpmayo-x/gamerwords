export function NavBar({ current, onNavigate }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: '\u{1F3E0}' },
    { id: 'quiz', label: 'Quiz', icon: '\u{1F3AF}' },
    { id: 'dictionary', label: 'Dictionary', icon: '\u{1F4D6}' },
    { id: 'settings', label: 'Settings', icon: '\u{2699}\u{FE0F}' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)',
      display: 'flex', justifyContent: 'center', zIndex: 100,
    }}>
      <div style={{ display: 'flex', maxWidth: 480, width: '100%' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            style={{
              flex: 1, padding: '10px 0', border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              color: current === tab.id ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontSize: 12, fontWeight: current === tab.id ? 700 : 400,
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
