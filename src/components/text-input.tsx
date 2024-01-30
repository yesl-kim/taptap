import _ from 'lodash'
import { useFormContext } from 'react-hook-form'
import clsx from 'clsx'

import { nestedValue } from '@/utils/parser'

type Size = 'xs' | 'sm' | 'base' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'

type Props = Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> & {
  name: string
  size?: Size
}

const TextInput = ({ name, size = '2xl', ...props }: Props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const errorMessage = nestedValue(`${name}.message`, errors)

  return (
    <div>
      <input
        {...props}
        {...register(name)}
        data-error={!!errorMessage}
        className={clsx(
          'border-b-[1px] border-b-gray-200 tracking-widest text-gray-600 outline-none transition-all placeholder:text-gray-600 focus:border-b-2 focus:border-b-blue-600 focus:outline-none data-[error=true]:border-b-red-600',
          `text-${size}`,
        )}
      />
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  )
}

export default TextInput
