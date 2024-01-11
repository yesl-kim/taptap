'use client'

import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { useFormContext } from 'react-hook-form'

import NonRepeatField from './non-repeat-field'
import WeeklyRepeatField from './weekly-repeat-field'
import BasicSelectButton from '../../basic-select-button'

const options = [
  { name: '반복 안함', value: null, field: <NonRepeatField name="repeats" /> },
  {
    name: '매주 반복',
    value: 'weekly',
    field: <WeeklyRepeatField name="repeats" />,
  },
]

export default function RepeatField() {
  const { resetField } = useFormContext()
  const [type, setType] = useState(options[1])
  const selectType = (newType: (typeof options)[number]) => {
    setType(newType)
    resetField('repeats')
  }

  return (
    <div className="flex flex-col gap-2">
      <Listbox value={type} onChange={selectType}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button as={BasicSelectButton} active={open}>
              {type.name}
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 bg-white rounded-md shadow-lg focus:outline-none py-2 border border-gray-200 text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.name}
                  value={option}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none py-2 px-4 text-gray-900 ${
                      active && 'bg-neutral-200/70'
                    }`
                  }
                >
                  {option.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        )}
      </Listbox>
      {type.field}
    </div>
  )
}
