import { Listbox } from '@headlessui/react'
import { useMemo, useState } from 'react'
import { Controller, useController, useFormContext } from 'react-hook-form'
import { addMonths } from 'date-fns'

import useToday from '@/hooks/useToday'

import BasicSelectButton from '@/components/basic-select-button'
import DateSelect from '@/components/date-select'
import { TaskFormField } from '../task-form.types'

type Props = {
  name: string
}

const EndDateField = () => {
  const { today } = useToday()
  const { control, getValues } = useFormContext<TaskFormField>()

  const defaultValue = useMemo(
    () => addMonths(getValues('repeat.startDate') ?? today, 3),
    [today, getValues],
  )

  const options = useMemo(
    () => [
      { label: '반복 종료 안함', value: undefined },
      { label: '반복 종료 날짜', value: defaultValue },
    ],
    [defaultValue],
  )

  const {
    field: { value, onChange, ref },
  } = useController({ control, name: 'repeat.endDate' })

  return (
    <div className="flex gap-4">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button as={BasicSelectButton} active={open}>
              {value ? '반복 종료 날짜' : '반복 종료 안함'}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 rounded-md border border-gray-200 bg-white py-2 text-sm shadow-lg focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.label}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 text-gray-900 ${
                      active && 'bg-neutral-200/70'
                    }`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        )}
      </Listbox>

      {value && <DateSelect {...{ value, onChange, ref }} />}
    </div>
  )
}

export default EndDateField
