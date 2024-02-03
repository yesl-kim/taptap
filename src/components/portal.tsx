'use client'

import { useRef } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  selector?: string
} & PropsWithChildren

const WRAPPER_SELECTOR = '#modal'

const Portal = ({ children, selector = WRAPPER_SELECTOR }: Props) => {
  return createPortal(children, document.body)
}

export default Portal
