'use client'

import { ButtonHTMLAttributes, forwardRef, memo } from 'react'

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
    <div className="relative">
      <button
        ref={ref}
        {...buttonProps}
        aria-label={label}
        className={`${style.iconButton} ${className}`}
        type={type}
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
)

IconButton.displayName = 'IconButton'
export default memo(IconButton)
