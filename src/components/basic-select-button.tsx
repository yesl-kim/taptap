import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

const BasicSelectButton = forwardRef<HTMLButtonElement, Props>(
  ({ active = false, children, ...props }, ref) => (
    <button
      ref={ref}
      className="flex gap-6 items-center p-2 rounded hover:bg-neutral-100 focus:bg-neutral-200 transition focus:outline-none outline-none text-sm text-gray-900"
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
  )
)

BasicSelectButton.displayName = 'BasicSelectButton'

export default BasicSelectButton
