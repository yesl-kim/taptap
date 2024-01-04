'use client'

import { useState } from 'react'
import { Listbox } from '@headlessui/react'

import StyledSelectButton from '../styled-select-button'
import NonRepeatField from './non-repeat-field'
import WeeklyRepeatField from './weekly-repeat-field'

const options = [
  { name: '반복 안함', value: null, field: <NonRepeatField name="repeats" /> },
  {
    name: '매주 반복',
    value: 'weekly',
    field: <WeeklyRepeatField name="repeats" />,
  },
]

export default function RepeatField() {
  const [type, setType] = useState(options[0])

  return (
    <div>
      <Listbox value={type} onChange={setType}>
        <div className="relative">
          <Listbox.Button>
            <StyledSelectButton>
              <span>{type.name}</span>
            </StyledSelectButton>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 bg-white rounded-md shadow-lg focus:outline-none py-2 sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.name}
                value={option}
                className={({ active }) =>
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
      </Listbox>
      {type.field}
    </div>
  )
}
