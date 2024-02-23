'use client'
import { useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef<any>()
  const router = useRouter()

  const close = useCallback(() => {
    router.back()
  }, [router])

  const onClickOutside = useCallback(
    (e: any) => {
      if (e.target === overlay.current) {
        if (close) close()
      }
    },
    [close, overlay]
  )

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.key === 'Escape') close()
    },
    [close]
  )

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown])

  return (
    <div
      ref={overlay}
      className="fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60"
      onClick={onClickOutside}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-10/12 md:w-8/12 lg:w-1/2 p-6 bg-blue-100">
        {children}
      </div>
    </div>
  )
}
