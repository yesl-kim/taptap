import _ from 'lodash'
import { useFormContext } from 'react-hook-form'

import { nestedValue } from '@/utils/parser'

type TitleInputProps = {
  name: string
}

const TitleInput = ({ name }: TitleInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const errorMessage = nestedValue(`${name}.message`, errors)
  console.log(errors)
  console.log(errorMessage)

  return (
    <div>
      <input
        {...register(name)}
        placeholder="제목"
        data-error={!!errorMessage}
        className="text-2xl tracking-widest text-gray-600 placeholder:text-gray-600 border-b-[1px] border-b-gray-200 focus:border-b-2 focus:border-b-blue-600 transition-all focus:outline-none outline-none data-[error=true]:border-b-red-600"
      />
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  )
}

export default TitleInput
