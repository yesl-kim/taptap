import { memo, useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { format, isSameDay, getDay, differenceInDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import _ from 'lodash'
import { Square2StackIcon } from '@heroicons/react/24/outline'

import useToday from '@/hooks/useToday'

import PeriodFields from '@/components/period-fields'
import DayOfWeekSelect from './day-of-week-select'
import EndDateField from './end-date-field'
import { PeriodType } from '../task-form.types'
import IconButton from '@/components/icon-button'

// name = 'repeat'
const WeeklyRepeatField = () => {
  const { today } = useToday()

  const {
    formState: { defaultValues },
    setValue,
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

  const 요일간기간복사 = (value: PeriodType[]): void => {
    selectedDays.forEach((date) => {
      const name = `repeat.data.weekly.${getDay(date)}.times` // FIXME
      setValue(name, value)
    })
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
              copy={요일간기간복사}
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
  copy: (times: PeriodType[]) => void
}

const DayOfWeekRepeatField = memo(
  ({ name, selectedDate, copy }: DayOfWeekRepeatFieldProps) => {
    const { register, unregister, getValues } = useFormContext()

    const onCopy = () => {
      const times = getValues(`${name}.times`)
      copy(times)
    }

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
      <div className="group flex gap-2">
        <span className="flex max-h-[40px] basis-10 items-center text-gray-900">
          {format(selectedDate, 'E', { locale: ko })}
        </span>
        <PeriodFields name={`${name}.times`} />
        <div className="flex max-h-[40px] items-center group-only:hidden">
          <IconButton
            type="button"
            onClick={onCopy}
            Icon={Square2StackIcon}
            label="모든 요일에 기간 복사"
          />
        </div>
      </div>
    )
  },
)

DayOfWeekRepeatField.displayName = 'DayOfWeekRepeatField'
