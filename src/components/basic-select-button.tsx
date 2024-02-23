import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

const BasicSelectButton = forwardRef<HTMLButtonElement, Props>(
  ({ active = false, children, ...props }, ref) => (
    <button
      ref={ref}
      className="flex items-center gap-6 rounded p-2 text-sm text-gray-600 outline-none transition hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none"
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-open={active}
        aria-hidden
        className="w-3 data-[open=true]:rotate-180"
        strokeWidth={3}
      />
    </button>
  ),
)

BasicSelectButton.displayName = 'BasicSelectButton'

export default BasicSelectButton
