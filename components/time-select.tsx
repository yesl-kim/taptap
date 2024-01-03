'use client'

import { memo, useMemo } from 'react'
import { Listbox } from '@headlessui/react'

import {
  addHours,
  eachMinuteOfInterval,
  format,
  isSameMinute,
  roundToNearestMinutes,
  subMinutes,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { round30Minutes } from '@/lib/datetime'

interface Range {
  start: Date
  end: Date
}

interface TimeSelectProps {
  name: string
  value: Date
  onChange: (value: Date) => void
  range: Range
  valid?: boolean
  placeholder?: string
}

const TimeSelect = ({
  range,
  valid = true,
  placeholder,
  ...props
}: TimeSelectProps) => (
  <Listbox {...props}>
    {({ open, value }) => (
      <div className="relative">
        <Listbox.Button
          className={`w-[90px] py-2 rounded transition-all outline-none focus:outline-none text-sm text-gray-600 text-center ${
            valid
              ? `bg-neutral-100 hover:bg-neutral-200 ${
                  open ? 'border-b-2 border-blue-600' : ''
                }`
              : `border-red-600 bg-red-100 hover:bg-red-200 ${
                  open ? 'border-b-2' : 'border-b-[1px]'
                }`
          }`}
        >
          {value ? (
            timeFormat(value)
          ) : (
            <span className="text-gray-500">{placeholder ?? '시간 선택'}</span>
          )}
        </Listbox.Button>
        <Listbox.Options className="absolute max-h-60 min-w-[150px] mt-2 py-2 overflow-auto rounded bg-white shadow-lg focus:outline-none z-10 sm:text-sm">
          {getTimeOptions(range).map((time) => (
            <Listbox.Option
              key={time.toString()}
              value={time}
              className={({ active }) =>
                `cursor-pointer select-none py-2 px-4 text-gray-900 ${
                  active
                    ? 'bg-neutral-200/70'
                    : isSameMinute(time, value)
                    ? 'bg-blue-100'
                    : ''
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

export default memo(TimeSelect)

const timeFormat = (time: Date) => format(time, 'a H:mm', { locale: ko })

const STEP = 30
const getTimeOptions = ({ start, end }: Range) =>
  eachMinuteOfInterval(
    {
      start: round30Minutes(start),
      end: round30Minutes(subMinutes(end, STEP)),
    },
    { step: STEP }
  )
