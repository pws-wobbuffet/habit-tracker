import { useEffect, useState } from 'react'

// True only on phones (shorter side < 768px) held in landscape. Tablets and
// desktops (shorter side >= 768) are allowed to use landscape freely.
function isPhoneLandscape(): boolean {
  return (
    window.innerWidth > window.innerHeight && Math.min(window.innerWidth, window.innerHeight) < 768
  )
}

export function OrientationLock() {
  const [locked, setLocked] = useState(isPhoneLandscape)
  useEffect(() => {
    const update = () => setLocked(isPhoneLandscape())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (!locked) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-bg px-8 text-center"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <svg
        width="46"
        height="46"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12a8 8 0 1 0 2.3-5.6" />
        <path d="M4 4v3.5h3.5" />
      </svg>
      <div className="text-lg font-bold text-ink">Rotate your device</div>
      <p className="max-w-xs text-sm text-ink-2">
        Habitus is designed for portrait. Turn your phone upright to continue.
      </p>
    </div>
  )
}
