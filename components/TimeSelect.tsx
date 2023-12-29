'use client'

import { useMemo } from 'react'
import { Listbox } from '@headlessui/react'

import {
  addHours,
  eachMinuteOfInterval,
  format,
  roundToNearestMinutes,
  subMinutes,
} from 'date-fns'
import { ko } from 'date-fns/locale'

import useToday from '@/lib/useToday'

interface Range {
  start: Date
  end: Date
}

interface TimeSelectProps {
  name: string
  value?: Date
  onChange: (value: Date) => void // FIXME
  range?: Range
  valid?: boolean
}

// 1. range 기본값 설정
// 2. range로 default value 설정
const TimeSelect = ({
  range: _range,
  valid = true,
  ...props
}: TimeSelectProps) => {
  const { getStartOfDay, getEndOfDay } = useToday()
  const range = useMemo(
    () =>
      _range
        ? _range
        : { start: getStartOfDay(new Date()), end: getEndOfDay(new Date()) },
    [_range, getStartOfDay, getEndOfDay]
  )

  const defaultValue = useMemo(() => addHours(round(range.start), 1), [range])

  return (
    <Listbox {...props} defaultValue={defaultValue}>
      {({ open, value }) => (
        <div className="relative">
          <Listbox.Button
            className={`py-2 px-4 rounded transition-all ${
              valid
                ? `bg-neutral-100 hover:bg-neutral-200 ${
                    open ? 'border-b-2 border-blue-500' : ''
                  }`
                : `border-red-500 bg-red-100 hover:bg-red-200 ${
                    open ? 'border-b-2' : 'border-b-[1px]'
                  }`
            }`}
          >
            {timeFormat(value)}
          </Listbox.Button>
          <Listbox.Options className="absolute max-h-60 min-w-[150px] mt-2 py-2 overflow-auto rounded bg-white shadow-lg focus:outline-none z-10 sm:text-sm">
            {getTimeOptions(range).map((time) => (
              <Listbox.Option
                key={time.toString()}
                value={time}
                className={({ active, selected }) =>
                  `cursor-pointer select-none py-2 px-4 text-gray-900 ${
                    active || selected ? 'bg-neutral-200/70' : ''
                  }`
                }
              >
                {timeFormat(time)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  )
}

export default TimeSelect

const timeFormat = (time: Date) => format(time, 'a H:mm', { locale: ko })

const STEP = 30
const round = (time: Date) =>
  roundToNearestMinutes(time, {
    nearestTo: STEP,
    roundingMethod: 'ceil',
  })

const getTimeOptions = ({ start, end }: Range) =>
  eachMinuteOfInterval(
    {
      start: round(start),
      end: round(subMinutes(end, 30)),
    },
    { step: STEP }
  )
