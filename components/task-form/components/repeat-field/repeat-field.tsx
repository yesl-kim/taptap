'use client'

import { Listbox } from '@headlessui/react'
import { format, getDay, setDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useState } from 'react'
import StyledSelectButton from '../styled-select-button'

const weekdays = Array.from({ length: 7 }).map((_, i) => setDay(new Date(), i))

// 1. 반복 안함 -> 날짜 직접 추가
// 2. 매주 반복 -> 요일별 시간 추가
const options = [
  { name: '반복 안함', value: null, field: <div>반복 안함 field</div> },
  { name: '매주 반복', value: 'weekly', field: <div>매주 반복 field</div> },
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
