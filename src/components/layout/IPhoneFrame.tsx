import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function IPhoneFrame({ children }: Props) {
  return (
    <div className="h-screen bg-parchment md:flex md:items-center md:justify-center md:min-h-screen md:bg-gray-200">
      <div className="relative h-full bg-parchment md:h-[844px] md:w-[390px] md:overflow-hidden md:rounded-[3rem] md:shadow-2xl">
        {/* Dynamic Island — desktop only */}
        <div
          className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black rounded-full"
          style={{ width: 120, height: 34 }}
        />
        <div className="h-full overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
