export function StatusBar() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div
      className="flex items-center justify-between px-6 text-xs font-medium text-text"
      style={{ paddingTop: 'calc(var(--safe-top) + 12px)', height: 'calc(var(--safe-top) + 44px)' }}
    >
      <span>{timeStr}</span>
      <div className="flex items-center gap-1 text-text/70">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="6" width="3" height="6" rx="1" />
          <rect x="4" y="4" width="3" height="8" rx="1" />
          <rect x="8" y="2" width="3" height="10" rx="1" />
          <rect x="12" y="0" width="3" height="12" rx="1" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-3.5a5.5 5.5 0 014.24 2L14 6.2A8 8 0 008 4a8 8 0 00-6 2.2l1.76 1.8A5.5 5.5 0 018 6zm0-4a9.5 9.5 0 017.19 3.3L16.77 3.6A12 12 0 008 0 12 12 0 00-.77 3.6l1.58 1.7A9.5 9.5 0 018 2z" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="16" height="8" rx="2" />
          <path d="M23 4v4a2 2 0 000-4z" />
        </svg>
      </div>
    </div>
  )
}
