'use client'

import { memo } from 'react'
import { differenceInHours, eachHourOfInterval, format } from 'date-fns'
import { ko } from 'date-fns/locale'
import clsx from 'clsx'

import useToday from '@/hooks/useToday'

import { HEIGHT_PER_STEP, STEP, HEIGHT_PER_HOUR } from './timetable.constants'

const TimetableGrid = () => {
  const { getStartOfDay, today, getEndOfDay } = useToday()
  const $24HOURS = eachHourOfInterval({
    start: getStartOfDay(today),
    end: getEndOfDay(today),
  })

  return (
    <div className="pointer-events-none absolute inset-0">
      {$24HOURS.map((hour, i) => {
        const y =
          differenceInHours(hour, getStartOfDay(today)) * HEIGHT_PER_HOUR

        return (
          <div
            aria-hidden
            key={format(hour, 'HH')}
            className="absolute right-0 top-0 h-[1px] bg-gray-200 [width:calc(100%+8px)]"
            style={{ transform: `translateY(${y}px)` }}
          >
            <span
              className={clsx(
                'absolute right-[100%] top-[50%] mr-2 w-[max-content] -translate-y-[50%] text-[11px] text-gray-400',
                i === 0 && 'hidden',
              )}
            >
              {format(hour, 'aaa h시', { locale: ko })}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default memo(TimetableGrid)
