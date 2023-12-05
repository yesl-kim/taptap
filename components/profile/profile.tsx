'use client'

import Link from 'next/link'
import Avatar from './avatar'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function Profile() {
  const [on, setOn] = useState(false)
  const toggle = useCallback(() => setOn((prev) => !prev), [])
  const close = useCallback(() => setOn(false), [])

  const inside = useRef<HTMLDivElement>(null)
  const handleOutsideClick = useCallback(
    ({ target }: MouseEvent) => {
      if (
        target instanceof HTMLElement &&
        inside.current &&
        !inside.current.contains(target)
      ) {
        close()
      }
    },
    [close]
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  })

  return (
    <div className="relative inline" ref={inside}>
      <button onClick={toggle} aria-expanded={on}>
        <Avatar />
      </button>
      {on && (
        <div className="absolute right-0 top-full mt-2 shadow-lg rounded-md bg-slate-300 w-[150px] py-2 px-3">
          <Link href="api/auth/signout">Logout</Link>
        </div>
      )}
    </div>
  )
}
