'use client'

import { useCalendar } from '@h6s/calendar'
import { format, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

import IconButton from '@/components/icon-button'
import DateCell from './date-cell'

interface Props {
  selectedDate: Date
}

const Calendar = ({ selectedDate }: Props) => {
  const c = useCalendar()
  const { headers, body, cursorDate, navigation } = c
  console.log(c)

  return (
    <div className="px-3 w-[256px]">
      <header className="flex items-center px-3 mb-3">
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
        <table className="border-spacing-1 border-separate">
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
                      active={isSameDay(value, selectedDate)}
                      onClick={(e) => console.log(e)}
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

export default Calendar
