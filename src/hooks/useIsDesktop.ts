import { useEffect, useState } from 'react'

// A device is "desktop" only if its *shorter* viewport side is >= 768px.
// Keying off the shorter side (instead of width) keeps phones on the mobile
// layout in landscape too — their short side stays ~390px — while real
// tablets/desktops still get the desktop layout in either orientation.
function compute(): boolean {
  return Math.min(window.innerWidth, window.innerHeight) >= 768
}

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(compute)
  useEffect(() => {
    const update = () => setIsDesktop(compute())
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return isDesktop
}
