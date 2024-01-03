'use client'

import { addHours, endOfDay, startOfDay } from 'date-fns'
import { useFieldArray, useFormContext } from 'react-hook-form'
import PeriodField, { PeriodData } from '@/components/period-field'
import { round30Minutes } from '@/lib/datetime'
import useToday from '@/lib/useToday'

import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import IconButton from './icon-button'

interface Props {
  name: string
}

// TODO: getStartOfDay(date) -> date = <선택된 날짜> | <오늘>
// => 선택된 날짜 기준으로 받을 수 있도록
// TODO: style
const PeriodFields = ({ name }: Props) => {
  const { control, watch } = useFormContext()
  const values: PeriodData[] = watch(name, [])
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

  return (
    <div className="flex gap-2">
      <div className={'w-[256px]'}>
        {fields.length === 0 ? (
          <p className="h-[40px] px-2 leading-[40px] text-sm text-gray-500">
            기간 설정 안함
          </p>
        ) : (
          fields.map((field, idx) => (
            <div key={field.id} className="flex gap-2 items-center">
              <PeriodField name={`${name}.${idx}`} range={getRange(idx)} />
              <IconButton
                Icon={XMarkIcon}
                label="기간 삭제"
                onClick={() => remove(idx)}
              />
            </div>
          ))
        )}
      </div>
      <div className="h-[40px] flex items-center">
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
