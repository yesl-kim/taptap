'use client'

import { ButtonHTMLAttributes, forwardRef, memo } from 'react'

import Tooltip from './tooltip'

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'aria-label' | 'aria-labelledby'
> & {
  Icon: HeroIcon
  label: string
}

export const style = {
  iconButton:
    'w-[28px] p-1.5 group hover:bg-neutral-200 rounded-full align-center peer',
  icon: 'group-hover:text-neutral-900 text-neutral-500 stroke-2',
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, Icon, label, type = 'button', ...buttonProps }, ref) => (
    <Tooltip
      label={label}
      trigger={
        <button
          ref={ref}
          {...buttonProps}
          className={`${style.iconButton} ${className}`}
          type={type}
        >
          <Icon aria-hidden className={style.icon} />
        </button>
      }
    />
  )
)

IconButton.displayName = 'IconButton'
export default memo(IconButton)
