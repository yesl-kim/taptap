import { forwardRef, useCallback, useMemo, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { addHours, addMinutes, isBefore, isSameMinute } from 'date-fns'
import _ from 'lodash'

import { round30Minutes } from '@/utils/datetime'
import { nestedValue } from '@/utils/parser'

import TimeSelect from './time-select'
import FieldError from './field-error'

type Key = 'start' | 'end'

export type Period = {
  [key in Key]: Date
}

type Errors = {
  [key in Key]?: string
}

type Payload = Pick<Period, 'start'> | Pick<Period, 'end'>

interface Props {
  range: Period
  value?: Period
  onChange: (value: Payload) => void
  errors?: Errors
}

const PeriodField = ({ range, value, onChange, errors }: Props) => {
  // const defaultValue = useMemo(() => getDefaultValue(range), [range])
  // const value = _value ?? defaultValue

  // const [prevRange, setPrevRange] = useState(range)
  // if (!isSameMinute(prevRange.start, range.start)) {
  //   trigger(`${name}.start`).finally(() => setPrevRange(range))
  // }

  const endRange = useMemo(
    () =>
      !value ? range : { start: addMinutes(value.start, 1), end: range.end },
    [value, range],
  )

  const _onChange = useCallback(
    (name: Key) => (v: Date) => onChange({ ...value, [name]: v } as Period),
    [onChange, value],
  )

  const errorMessage =
    errors && Object.values(errors).find((e) => !_.isEmpty(e))

  return (
    <div>
      <div className="flex items-center gap-2">
        <TimeSelect
          range={range}
          value={value?.start}
          onChange={_onChange('start')}
          valid={!_.get(errors, 'start')}
          placeholder="시작 시간"
        />
        <span className="p-2" aria-hidden>
          -
        </span>
        <TimeSelect
          range={endRange}
          value={value?.end}
          onChange={_onChange('end')}
          valid={!_.get(errors, 'end')}
          placeholder="종료 시간"
        />
      </div>
      <div className="mt-1 pl-1">
        <FieldError message={errorMessage} />
      </div>
    </div>
  )
}

export default PeriodField

const getDefaultValue = (range: Period): Period => {
  const start = addHours(round30Minutes(range.start), 1)
  const end = addHours(start, 1)
  return { start, end }
}
