'use client'

import clsx from 'clsx'
import { UIEventHandler, useRef, useState } from 'react'

const TimetableContainer = ({ children }: PropsWithChildren) => {
  const [scrolling, setScrolling] = useState(false)
  const onScroll: UIEventHandler<HTMLDivElement> = (e) =>
    setScrolling(e.currentTarget.scrollTop > 0)

  const view = useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-full w-full" data-scrolling={scrolling}>
      <div
        className={clsx(
          'pointer-events-none absolute right-0 top-0 h-[4px] w-full opacity-0 shadow-[inset_0_1px_1px_0_rgba(0,0,0,0.14),inset_0_2px_1px_-1px_rgba(0,0,0,0.12)] transition-opacity ease-in before:absolute before:left-0 before:block before:h-[2px] before:w-[80px] before:bg-gradient-to-r before:from-white before:to-[rgba(255,255,255,0)] after:absolute after:right-0 after:block after:h-[2px] after:w-[80px] after:bg-gradient-to-r after:from-[rgba(255,255,255,0)] after:to-white',
          scrolling && 'opacity-100',
        )}
      />
      <div
        className="absolute inset-0 overflow-y-scroll"
        onScroll={onScroll}
        ref={view}
      >
        <div className="relative ml-20">{children}</div>
      </div>
    </div>
  )
}

export default TimetableContainer
