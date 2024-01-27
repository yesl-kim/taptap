import { memo, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { format, isSameDay, getDay, differenceInDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import _ from 'lodash'

import useToday from '@/hooks/useToday'

import PeriodFields from '@/components/period-fields'
import { PeriodData } from '@/components/period-field'
import DayOfWeekSelect from './day-of-week-select'
import EndDateField from './end-date-field'

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
// name = 'repeat'
const WeeklyRepeatField = ({ name }: Props) => {
  const { today } = useToday()

  const {
    formState: { defaultValues },
  } = useFormContext()

  const startDate = _.get(defaultValues, 'repeat.startDate') ?? today
  const [selectedDays, setSelectedDays] = useState<Date[]>([startDate])

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
        base={startDate}
        selectedDays={selectedDays}
        onClickDay={toggleSelectDay}
      />
      <div className="my-2">
        {selectedDays.map((date) => {
          const day = getDay(date)
          return (
            <DayOfWeekRepeatField
              key={day}
              name={`repeat.data.weekly.${day}`}
              selectedDate={date}
            />
          )
        })}
      </div>
      <EndDateField />
    </>
  )
}

export default WeeklyRepeatField

type DayOfWeekRepeatFieldProps = {
  name: string
  selectedDate: Date
}

const DayOfWeekRepeatField = memo(
  ({ name, selectedDate }: DayOfWeekRepeatFieldProps) => {
    const { register, unregister } = useFormContext()

    useEffect(() => {
      register(`${name}.interval`, {
        value: 1,
      })
      register(`${name}.daysOfWeek`, {
        value: [getDay(selectedDate)],
      })
      return () => unregister(name)
    }, [name, selectedDate, register, unregister])

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
