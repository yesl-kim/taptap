import { memo, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  format,
  isSameDay,
  getDay,
  isAfter,
  differenceInDays,
  getDate,
} from 'date-fns'
import { ko } from 'date-fns/locale'
import { RepeatType } from '@prisma/client'
import _ from 'lodash'

import useToday from '@/hooks/useToday'

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
}

// TODO: 요일간 기간 복사
// TODO: 반복 종료 날짜
const WeeklyRepeatField = ({ name }: Props) => {
  const { today } = useToday()
  const {
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
        {selectedDays.map((date) => {
          const day = getDay(date)
          return (
            <DayOfWeekRepeatField
              key={day}
              name={`${name}.${day}`}
              selectedDate={date}
              startDate={defaultStartDate}
            />
          )
        })}
      </div>
    </>
  )
}

export default WeeklyRepeatField

type DayOfWeekRepeatFieldProps = {
  name: string
  startDate: Date
  selectedDate: Date
}

const DayOfWeekRepeatField = memo(
  ({ name, startDate, selectedDate }: DayOfWeekRepeatFieldProps) => {
    const { register, unregister } = useFormContext()

    useEffect(() => {
      register(`${name}.startDate`, {
        value: startDate,
        valueAsDate: true,
      })
      register(`${name}.type`, {
        value: RepeatType.Weekly,
      })
      register(`${name}.interval`, {
        value: 1,
      })
      register(`${name}.daysOfWeek`, {
        value: [getDay(selectedDate)],
      })
      return () => unregister(name)
    }, [name, selectedDate, startDate, register, unregister])

    return (
      <div className="flex gap-2">
        <span className="text-gray-900 basis-10 max-h-[40px] flex items-center">
          {format(selectedDate, 'E', { locale: ko })}
        </span>
        <PeriodFields name={`${name}.times`} />
      </div>
    )
  }
)

DayOfWeekRepeatField.displayName = 'DayOfWeekRepeatField'
