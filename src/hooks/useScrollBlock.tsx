import { useCallback, useRef } from 'react'

const safeDocument = typeof document !== 'undefined' ? document : {}

export const useScrollBlock = () => {
  const isScrollBlocked = useRef(false)
  const html = safeDocument.documentElement
  const { body } = safeDocument

  const validate = useCallback(
    () => html && body && body.style && isScrollBlocked.current,
    [html, body]
  )

  const blockScroll = useCallback(() => {
    if (validate()) return

    const scrollBarWidth = window.innerWidth - html.clientWidth
    const bodyPaddingRight =
      parseInt(
        window.getComputedStyle(body).getPropertyValue('padding-right')
      ) || 0

    html.style.position = 'relative'
    html.style.overflow = 'hidden'
    body.style.position = 'relative'
    body.style.overflow = 'hidden'
    body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`

    isScrollBlocked.current = true
  }, [validate, html, body])

  const allowScroll = useCallback(() => {
    if (validate()) return

    html.style.position = ''
    html.style.overflow = ''
    body.style.position = ''
    body.style.overflow = ''
    body.style.paddingRight = ''

    isScrollBlocked.current = false
  }, [body?.style, validate, html?.style])

  return { blockScroll, allowScroll }
}
