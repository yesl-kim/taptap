'use client'

import { addHours } from 'date-fns'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { round30Minutes } from '@/utils/datetime'
import useToday from '@/hooks/useToday'
import { isEmpty } from '@/utils/validator'

import PeriodField, { Period as PeriodType } from '@/components/period-field'
import IconButton from './icon-button'

interface Props {
  name: string
}

const PeriodFields = ({ name }: Props) => {
  const { control, watch } = useFormContext()
  const values: PeriodType[] = watch(name, [])
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  })

  const { getStartOfDay, getEndOfDay } = useToday()
  const addField = () => {
    const last = values[values.length - 1]
    const lastTime = last?.end
      ? round30Minutes(last.end)
      : getStartOfDay(new Date())

    append({ start: addHours(lastTime, 1), end: addHours(lastTime, 2) })
  }

  const getRange = (idx: number) => {
    const start = idx > 0 ? values[idx - 1].end : getStartOfDay(new Date())
    const end = getEndOfDay(new Date())
    return { start, end }
  }

  console.log('times', values)

  return (
    <div className="flex gap-2">
      <div className={'w-[256px]'}>
        {isEmpty(fields) ? (
          <p className="h-[40px] px-2 text-sm leading-[40px] text-gray-500">
            기간 설정 안함
          </p>
        ) : (
          fields.map((field, i) => (
            <div key={field.id} className="flex items-center gap-2">
              <Controller
                control={control}
                name={`${name}.${i}`}
                render={({ field: { value: period, onChange } }) => (
                  <PeriodField
                    range={getRange(i)}
                    value={period}
                    onChange={onChange}
                  />
                )}
              />
              <IconButton
                Icon={XMarkIcon}
                label="기간 삭제"
                onClick={() => remove(i)}
              />
            </div>
          ))
        )}
      </div>
      <div className="flex h-[40px] items-center">
        <IconButton
          Icon={PlusCircleIcon}
          label="이 요일에 기간 추가"
          onClick={addField}
        />
      </div>
    </div>
  )
}

export default PeriodFields
