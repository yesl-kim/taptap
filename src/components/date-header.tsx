'use client'

import { format, getDate, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'

import useToday from '@/hooks/useToday'

type Props = {
  date: Date
}

const DateHeader = ({ date }: Props) => {
  const { today } = useToday()
  const isToday = isSameDay(today, date)

  return (
    <div
      className="group flex flex-col justify-center items-center"
      data-today={isToday}
    >
      <span className="text-xs text-gray-600 group-data-[today=true]:text-blue-600">
        {format(date, 'eee', { locale: ko })}
      </span>
      <div className="flex items-center w-12 h-12 rounded-full justify-center text-gray-600 text-2xl font-light group-data-[today=true]:text-white group-data-[today=true]:bg-blue-600">
        {getDate(date)}
      </div>
    </div>
  )
}

export default DateHeader
