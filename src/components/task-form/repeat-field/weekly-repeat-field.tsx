import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { format, isSameDay, getDay, isAfter, differenceInDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import { RepeatType } from '@prisma/client'
import _ from 'lodash'

import useToday from '@/hooks/useToday'

import PeriodFields from '@/components/period-fields'
import { PeriodData } from '@/components/period-field'
import DayOfWeekSelect from './day-of-week-select'
import { TaskFormData } from '../task-form'

export type RepeatFormData = {
  startDate: Date
  times: PeriodData[]
  daysOfMonth?: number[]
  endDate?: Date
}
interface Props {
  name: string
}

// TODO: 요일간 기간 복사
// TODO: 반복 종료 날짜
const WeeklyRepeatField = ({ name }: Props) => {
  const { today } = useToday()
  const {
    register,
    formState: { defaultValues },
  } = useFormContext()
  const defaultStartDate = _.get(defaultValues, `${name}.startDate`) ?? today
  const [selectedDays, setSelectedDays] = useState<Date[]>([defaultStartDate])

  const selectDay = (day: Date) => {
    setSelectedDays((ds) => {
      const newDays = ds.concat(day)
      return newDays.sort(differenceInDays)
    })
  }

  const unselectDay = (day: Date) => {
    setSelectedDays((ds) => {
      const newDays = ds.filter((d) => !isSameDay(d, day))
      return _.isEmpty(newDays) ? ds : newDays
    })
  }

  const toggleSelectDay = (day: Date) => {
    if (selectedDays.some((d) => isSameDay(d, day))) {
      unselectDay(day)
    } else {
      selectDay(day)
    }
  }

  return (
    <>
      <DayOfWeekSelect
        base={defaultStartDate}
        selectedDays={selectedDays}
        onClickDay={toggleSelectDay}
      />
      <div className="mt-2">
        {selectedDays.map((date, i) => (
          <div key={date.toString()} className="flex gap-2 items-center">
            <input
              hidden
              readOnly
              {...register(`${name}.${i}.startDate`, {
                value: defaultStartDate,
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
            <span className="text-gray-900 basis-10">
              {format(date, 'E', { locale: ko })}
            </span>
            <PeriodFields name={`${name}.${i}.times`} />
          </div>
        ))}
      </div>
    </>
  )
}

export default WeeklyRepeatField
