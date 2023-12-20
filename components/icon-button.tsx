'use client'

import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  memo,
} from 'react'
import { useFormStatus } from 'react-dom'

interface Props
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'children'
  > {
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined
      titleId?: string | undefined
    } & React.RefAttributes<SVGSVGElement>
  >
}

export const style = {
  iconButton: 'w-[30px] p-1.5 group hover:bg-neutral-200 rounded-full',
  icon: 'group-hover:text-neutral-900 text-neutral-500 stroke-2',
}

const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButtonComponent({ className, Icon, ...buttonProps }, ref) {
    const { pending } = useFormStatus()

    return (
      <button
        ref={ref}
        aria-disabled={pending}
        className={`${style.iconButton} ${className}`}
        {...buttonProps}
      >
        <Icon aria-hidden className={style.icon} />
      </button>
    )
  }
)

export default memo(IconButton)
