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
  label: string
  'aria-label'?: string
}

// aria 속성을 라벨로 받고 싶다면
// https://stackoverflow.com/questions/73887723/enforce-mutually-exclusive-aria-label-attributes-via-types-and-modify-the-props
export const style = {
  iconButton: 'w-[30px] p-1.5 group hover:bg-neutral-200 rounded-full peer',
  icon: 'group-hover:text-neutral-900 text-neutral-500 stroke-2',
}

const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButtonComponent(
    { className, Icon, label, ...buttonProps },
    ref
  ) {
    return (
      <div className="relative">
        <button
          ref={ref}
          aria-label={label}
          className={`${style.iconButton} ${className}`}
          {...buttonProps}
        >
          <Icon aria-hidden className={style.icon} />
        </button>
        <div
          aria-hidden
          className="absolute left-[50%] top-[100%] -translate-x-[50%] w-auto z-10 bg-black/70 py-1 px-2 rounded-md text-white text-xs whitespace-nowrap hidden peer-hover:block"
        >
          {label}
        </div>
      </div>
    )
  }
)

export default memo(IconButton)
