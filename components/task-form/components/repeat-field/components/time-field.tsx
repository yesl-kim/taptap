'use client'

import { ChangeEventHandler, memo, useCallback, useMemo, useState } from 'react'
import {
  eachMinuteOfInterval,
  endOfToday,
  startOfToday,
  format,
  addHours,
  roundToNearestMinutes,
  addMinutes,
  max,
  subMinutes,
} from 'date-fns'
import { Listbox } from '@headlessui/react'
import StyledSelectButton from '../../styled-select-button'

interface Range {
  start: Date
  end: Date
}

interface Props extends Range {
  start: Date
  end: Date
  // delete: (idx: number) => void
}

const formatTime = (date: Date): string => format(date, 'HH:mm')

const getDefaultValue = (range: Range): Range => {
  const start = addHours(
    roundToNearestMinutes(range.start, {
      nearestTo: 30,
      roundingMethod: 'ceil',
    }),
    1
  )
  const end = addHours(start, 1)
  return { start, end }
}

const STEP = 30
const getTimeOptions = ({ start, end }: Range) =>
  eachMinuteOfInterval(
    {
      start: roundToNearestMinutes(start, {
        nearestTo: 30,
        roundingMethod: 'ceil',
      }),
      end: roundToNearestMinutes(subMinutes(end, 30), {
        nearestTo: 30,
        roundingMethod: 'ceil',
      }),
    },
    { step: STEP }
  )

// TODO: 종료 시간 필드는 start보다 크도록 (최대 오늘의 마지막) - useToday 필요

function TimeSelect({ start, end }: Props) {
  const [value, setValue] = useState<Range>(getDefaultValue({ start, end }))
  const selectTime = useCallback((name: keyof Range, value: string) => {
    setValue((prev) => ({ ...prev, [name]: new Date(value) }))
  }, [])

  return (
    <div className="flex gap-2 items-center">
      <Listbox
        value={value.start.toISOString()}
        onChange={(time) => selectTime('start', time)}
      >
        <div className="relative">
          <Listbox.Button>
            <StyledSelectButton>
              <span>{formatTime(value.start)}</span>
            </StyledSelectButton>
          </Listbox.Button>
          <Listbox.Options className="absolute max-h-60 min-w-[100px] py-2 overflow-auto rounded-md bg-white shadow-lg focus:outline-none z-10 sm:text-sm">
            {getTimeOptions({ start, end }).map((time) => (
              <Listbox.Option
                key={time.toString()}
                value={time.toISOString()}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-4 text-gray-900 ${
                    active && 'bg-neutral-200/70'
                  }`
                }
              >
                {formatTime(time)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      <span aria-hidden>-</span>
      <Listbox
        name="end"
        value={max([value.end, addHours(value.start, 1)]).toISOString()}
        onChange={(time) => selectTime('end', time)}
      >
        <div className="relative">
          <Listbox.Button>
            {({ value }) => (
              <StyledSelectButton>
                <span>{formatTime(new Date(value))}</span>
              </StyledSelectButton>
            )}
          </Listbox.Button>
          <Listbox.Options className="absolute max-h-60 min-w-[100px] py-2 overflow-auto rounded-md bg-white shadow-lg focus:outline-none z-10 sm:text-sm">
            {getTimeOptions({ start: value.start, end }).map((time) => (
              <Listbox.Option
                key={time.toString()}
                value={time.toISOString()}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-4 text-gray-900 ${
                    active && 'bg-neutral-200/70'
                  }`
                }
              >
                {formatTime(time)}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  )
}

export default memo(TimeSelect)
