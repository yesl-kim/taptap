import { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { format, isSameDay, getDay, isBefore, isAfter } from 'date-fns'
import { ko } from 'date-fns/locale'

import PeriodFields from '@/components/period-fields'
import { PeriodData } from '@/components/period-field'

import DayOfWeekSelect from './day-of-week-select'
import WeeklyPeriodFields from './weekly-period-fields'

// TODO: repeat type 지정
type RepeatType = null | 'Weekly'
// repeatField => RepeatFormData[]
export type RepeatFormData = {
  startDate: Date
  times: PeriodData[]
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
      {/* <WeeklyPeriodFields selectedDays={selectedDays} name={name} /> */}
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
            <span>{format(date, 'E', { locale: ko })}</span>
            <PeriodFields name={`${name}.${i}.times`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyRepeatField
