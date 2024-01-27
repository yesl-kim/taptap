'use client'

import React, { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { Controller, useController, useFormContext } from 'react-hook-form'
import { RepeatType } from '@prisma/client'

import useToday from '@/hooks/useToday'

import NonRepeatField from './non-repeat-field'
import WeeklyRepeatField from './weekly-repeat-field'
import BasicSelectButton from '../../basic-select-button'
import {
  TaskFormField,
  RepeatTypeValues,
  repeatTypeValues,
} from '../taskform.types'
import DateSelect from '@/components/date-select'

type Options = {
  [key in RepeatTypeValues]: {
    label: string
    value: RepeatTypeValues
    field: React.ReactNode
  }
}

const options: Options = {
  None: {
    label: '반복 안함',
    value: repeatTypeValues.Values.None,
    field: <NonRepeatField />,
  },
  Weekly: {
    label: '매주 반복',
    value: repeatTypeValues.Values.Weekly,
    field: <WeeklyRepeatField />,
  },
}

export default function RepeatField() {
  const { today } = useToday()
  const { control } = useFormContext<TaskFormField>()

  const {
    field: { value: selectedType, onChange },
  } = useController({ control, name: 'repeat.type' })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Listbox value={selectedType} onChange={onChange}>
          {({ open }) => (
            <div className="relative">
              <Listbox.Button as={BasicSelectButton} active={open}>
                {options[selectedType].label}
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 bg-white rounded-md shadow-lg focus:outline-none py-2 border border-gray-200 text-sm">
                {repeatTypeValues.options.map((type) => (
                  <Listbox.Option
                    key={type}
                    value={type}
                    className={({ active }) =>
                      `cursor-pointer select-none py-2 px-4 text-gray-900 ${
                        active && 'bg-neutral-200/70'
                      }`
                    }
                  >
                    {options[type].label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          )}
        </Listbox>
        {selectedType !== repeatTypeValues.Values.None && (
          <Controller
            control={control}
            name="repeat.startDate"
            defaultValue={today}
            render={({ field }) => (
              <>
                <DateSelect {...field} />
                <p className="text-xs text-gray-600">이후 반복</p>
              </>
            )}
          />
        )}
      </div>
      {options[selectedType].field}
    </div>
  )
}
