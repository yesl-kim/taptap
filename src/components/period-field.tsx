import { useMemo, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { addHours, addMinutes, isBefore, isSameMinute } from 'date-fns'

import { round30Minutes } from '@/utils/datetime'
import { nestedValue } from '@/utils/parser'

import TimeSelect from './time-select'

export type PeriodData = {
  start: Date
  end: Date
}

interface Props {
  name: string
  range: PeriodData
}

const PeriodField = ({ name, range }: Props) => {
  const {
    control,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext()

  const defaultValue = useMemo(() => getDefaultValue(range), [range])
  const value = watch(name, defaultValue)

  const [prevRange, setPrevRange] = useState(range)
  if (!isSameMinute(prevRange.start, range.start)) {
    trigger(`${name}.start`).finally(() => setPrevRange(range))
  }

  const endRange = useMemo(
    () => ({ start: addMinutes(value.start, 1), end: range.end }),
    [value, range]
  )

  const errorMessage =
    nestedValue(`${name}.start.message`, errors) ||
    nestedValue(`${name}.end.message`, errors)

  return (
    <div>
      <div className="flex gap-2 items-center">
        <Controller
          name={`${name}.start`}
          control={control}
          rules={{
            required: true,
            validate: (v: Date) =>
              isBefore(range.start, v) ||
              isSameMinute(range.start, v) ||
              '기간은 겹칠 수 없습니다.',
          }}
          defaultValue={defaultValue.start}
          render={({ field: { ref, onChange, ...props } }) => (
            <TimeSelect
              {...props}
              range={range}
              onChange={(e) => {
                onChange(e)
                trigger(`${name}.end`, { shouldFocus: true })
              }}
              valid={!nestedValue(`${name}.start`, errors)}
            />
          )}
        />
        <span className="p-2" aria-hidden>
          -
        </span>
        <Controller
          name={`${name}.end`}
          control={control}
          rules={{
            required: true,
            validate: (v) =>
              isBefore(value.start, v) ||
              '시작 시간은 종료 시간 이전이어야 합니다.',
          }}
          defaultValue={defaultValue.end}
          render={({ field: { ref, ...props } }) => (
            <TimeSelect
              {...props}
              range={endRange}
              valid={!nestedValue(`${name}.end`, errors)}
            />
          )}
        />
      </div>
      {errorMessage && (
        <p className="ml-3 pt-1 text-xs text-red-600">{errorMessage}</p>
      )}
    </div>
  )
}

export default PeriodField

const getDefaultValue = (range: PeriodData): PeriodData => {
  const start = addHours(round30Minutes(range.start), 1)
  const end = addHours(start, 1)
  return { start, end }
}
