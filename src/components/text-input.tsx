import clsx from 'clsx'
import { forwardRef, memo } from 'react'

import FieldError from './field-error'

type Size = 'xs' | 'sm' | 'base' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

type Props = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  keyof TextInputProps
> &
  TextInputProps

type TextInputProps = {
  size?: Size
  error?: string
  onChange: (value: string) => void
}

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ size = '2xl', error, onChange, ...props }, ref) => (
    <div>
      <input
        ref={ref}
        {...props}
        onChange={(e) => onChange(e.target.value)}
        data-error={!!error}
        className={clsx(
          'border-b-[1px] border-b-gray-200 tracking-widest text-gray-600 outline-none transition-all placeholder:text-gray-600 focus:border-b-2 focus:border-b-blue-600 focus:outline-none data-[error=true]:border-b-red-600',
          `text-${size}`,
        )}
      />
      <FieldError message={error} />
    </div>
  ),
)

TextInput.displayName = 'TextInput'
export default memo(TextInput)
