import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function IPhoneFrame({ children }: Props) {
  return (
    <>
      {/* Desktop: render inside an iPhone shell at 390x844 */}
      <div className="hidden md:flex items-center justify-center min-h-screen bg-gray-200">
        <div
          className="relative overflow-hidden bg-parchment rounded-[3rem] shadow-2xl"
          style={{ width: 390, height: 844 }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full"
            style={{ width: 120, height: 34 }}
          />
          <div className="h-full overflow-hidden">{children}</div>
        </div>
      </div>

      {/* Mobile: full screen */}
      <div className="md:hidden h-full bg-parchment">{children}</div>
    </>
  )
}
