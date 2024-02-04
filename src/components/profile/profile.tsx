'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { requestPath } from '@/constants/api'

import Avatar from './avatar'

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
    [close],
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
        <div className="absolute right-0 top-full mt-2 w-[150px] rounded-md bg-slate-300 px-3 py-2 shadow-lg">
          <Link href={requestPath.auth.signout}>Logout</Link>
        </div>
      )}
    </div>
  )
}
