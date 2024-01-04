import { RefObject, useCallback, useEffect } from 'react'

interface Props {
  outsideRef: RefObject<any>
  action: () => void
}

export const useOutsideClick = ({ outsideRef, action }: Props) => {
  const clickOutside = useCallback(
    ({ target }: MouseEvent) => {
      if (
        target instanceof HTMLElement &&
        outsideRef.current &&
        !outsideRef.current.contains(target)
      ) {
        action()
      }
    },
    [action, outsideRef]
  )

  useEffect(() => {
    document.addEventListener('mousedown', clickOutside)
    return () => {
      document.removeEventListener('mousedown', clickOutside)
    }
  })
}
