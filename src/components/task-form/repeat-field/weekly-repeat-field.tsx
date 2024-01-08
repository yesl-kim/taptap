import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { format, isSameDay, getDay, isAfter } from 'date-fns'
import { ko } from 'date-fns/locale'
import { RepeatType } from '@prisma/client'

import PeriodFields from '@/components/period-fields'
import { PeriodData } from '@/components/period-field'
import DayOfWeekSelect from './day-of-week-select'

export type RepeatFormData = {
  startDate: Date
  times: PeriodData[]
  daysOfMonth?: number[]
  endDate?: Date
}
interface Props {
  name: string
  base?: Date
}

// TODO: 요일간 기간 복사
// TODO: 반복 종료 날짜
const WeeklyRepeatField = ({ name, base = new Date() }: Props) => {
  const { register } = useFormContext()
  const [selectedDays, setSelectedDays] = useState<Date[]>([])

  const selectDay = (day: Date) => {
    setSelectedDays((ds) => {
      const i = ds.findIndex((d) => isAfter(d, day))
      if (i < 0) {
        return ds.concat(day)
      }
      return ds.slice(0, i).concat(day).concat(ds.slice(i))
    })
  }

  const unselectDay = (day: Date) => {
    setSelectedDays((ds) => ds.filter((d) => !isSameDay(d, day)))
  }

  const toggleSelectDay = (day: Date) => {
    if (selectedDays.some((d) => isSameDay(d, day))) {
      unselectDay(day)
    } else {
      selectDay(day)
    }
  }

  return (
    <div>
      <DayOfWeekSelect
        base={base}
        selectedDays={selectedDays}
        onClickDay={toggleSelectDay}
      />
      <div>
        {selectedDays.map((date, i) => (
          <div key={date.toString()}>
            <input
              hidden
              readOnly
              {...register(`${name}.${i}.startDate`, {
                value: base,
                valueAsDate: true,
                shouldUnregister: true,
              })}
            />
            <input
              hidden
              readOnly
              {...register(`${name}.${i}.type`, { value: RepeatType.Weekly })}
            />
            <input
              hidden
              readOnly
              {...register(`${name}.${i}.interval`, { value: 1 })}
            />
            <input
              hidden
              readOnly
              {...register(`${name}.${i}.daysOfWeek`, {
                value: [getDay(date)],
                shouldUnregister: true,
              })}
            />
            <span>{format(date, 'E', { locale: ko })}</span>
            <PeriodFields name={`${name}.${i}.times`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyRepeatField
