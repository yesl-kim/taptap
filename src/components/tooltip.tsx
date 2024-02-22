'use client'

import { useId, useRef } from 'react'

import { generateGuid } from '@/utils/parser'

type Props = {
  label: string
  trigger: React.ReactNode
}

const Tooltip = ({ label, trigger }: Props) => {
  const id = useId()

  return (
    <div className="relative">
      <div className="peer" aria-describedby={id}>
        {trigger}
      </div>
      <p
        id={id}
        role="tooltip"
        className="invisible absolute left-[50%] top-[100%] z-10 mt-1 w-auto -translate-x-[50%] whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-xs text-white peer-focus-within:visible peer-hover:visible"
      >
        {label}
      </p>
    </div>
  )
}

export default Tooltip
