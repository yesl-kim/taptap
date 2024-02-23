import { CheckIcon } from '@heroicons/react/24/outline'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

type CheckboxProps = {
  label?: string
}
type Props = Omit<ComponentPropsWithoutRef<'input'>, keyof CheckboxProps> &
  CheckboxProps

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, ...inputProps }, ref) => (
    <label className="group flex items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        hidden
        {...inputProps}
        className="peer"
      />
      <div
        aria-hidden
        className="flex h-5 w-5 items-center justify-center rounded-sm border-2 border-gray-600 bg-white transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600"
      >
        <CheckIcon className="text-white" strokeWidth={3} />
      </div>
      {label && <span className="text-sm text-gray-600">{label}</span>}
    </label>
  ),
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
