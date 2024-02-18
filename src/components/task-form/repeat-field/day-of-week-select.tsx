'use client'

import { memo, useCallback, useMemo } from 'react'
import { getDay, format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Props {
  base: Date // base를 포함하는 주간을 렌더
  selectedDays: Date[]
  onClickDay: (day: Date) => void
}

const DayOfWeekSelect = ({ base, selectedDays, onClickDay }: Props) => {
  const weekdays = useMemo(() => getWeekdays(base), [base])
  const isActive = useCallback(
    (day: Date) => selectedDays.some((d) => isSameDay(d, day)),
    [selectedDays]
  )

  return (
    <div className="flex gap-2 items-center">
      {weekdays.map((date) => (
        <button
          type="button"
          key={getDay(date)}
          onClick={() => onClickDay(date)}
          className={`w-[30px] h-[30px] leading-[30px] align-center rounded-full text-xs ${
            isActive(date)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {format(date, 'E', { locale: ko })}
        </button>
      ))}
    </div>
  )
}

const getWeekdays = (date: Date) => {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export default memo(DayOfWeekSelect)
