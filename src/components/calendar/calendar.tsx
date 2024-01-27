'use client'

import { useCalendar } from '@h6s/calendar'
import { format, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { forwardRef } from 'react'

import IconButton from '@/components/icon-button'
import DateCell from './date-cell'

interface Props {
  selectedDate?: string | number | Date
  onChange: (date: Date) => void
}

const Calendar = forwardRef<HTMLDivElement, Props>(
  ({ selectedDate, onChange }, ref) => {
    const { headers, body, cursorDate, navigation } = useCalendar()

    return (
      <div className="px-3 w-[256px]" ref={ref}>
        <header className="flex items-center pl-2 mb-3">
          <span className="text-gray-700 mr-auto">
            {format(cursorDate, 'yyyy년 M월')}
          </span>
          <IconButton
            Icon={ChevronLeftIcon}
            label="이전 달"
            onClick={navigation.toPrev}
          />
          <IconButton
            Icon={ChevronRightIcon}
            label="다음 달"
            onClick={navigation.toNext}
          />
        </header>
        <section>
          <table className="w-full border-spacing-1 border-separate">
            <thead>
              <tr>
                {headers.weekDays.map(({ key, value }) => (
                  <th className="text-xs text-gray-400 font-medium" key={key}>
                    {format(value, 'E', { locale: ko })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.value.map(({ key, value: days }) => (
                <tr key={key}>
                  {days.map(({ key, value, isCurrentMonth }) => (
                    <td key={key}>
                      <DateCell
                        value={value}
                        active={
                          !!selectedDate && isSameDay(value, selectedDate)
                        }
                        onClick={onChange}
                        isCurrentMonth={isCurrentMonth}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    )
  }
)

Calendar.displayName = 'Calendar'

export default Calendar
