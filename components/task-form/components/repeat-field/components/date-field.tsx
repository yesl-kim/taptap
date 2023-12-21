'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { CheckIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import TimeField from './time-field'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'

interface DateForm {
  times: [string[]]
}
export default function DateField() {
  const [allday, setAllday] = useState(false)
  const formMethod = useForm<DateForm>({
    defaultValues: {
      times: [[]],
    },
  })
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: formMethod.control, // control props comes from useForm (optional: if you are using FormContext)
      name: 'times', // unique name for your Field Array
    }
  )
  console.log(formMethod.watch('times'))

  return (
    <FormProvider {...formMethod}>
      <div className="flex gap-2 mb-2 items-start">
        <input type="date" name="startDate" />
        <div>
          {!allday &&
            fields.map((field, index) => (
              <TimeField
                key={field.id}
                name={`times.${index}`}
                start={new Date('2023-12-21 9:00')}
                end={new Date('2023-12-21 23:31')}
              />
            ))}
        </div>
        <div
          role="button"
          aria-label="시간 추가"
          onClick={() => append([''])}
          className="w-[22px]"
        >
          <PlusCircleIcon
            aria-hidden
            className="text-base text-neutral-600"
            strokeWidth={2}
          />
        </div>
      </div>
      <Switch
        checked={allday}
        onChange={setAllday}
        className="flex gap-2 items-center cursor-pointer"
      >
        <div
          role="checkbox"
          aria-checked={allday}
          className="w-[18px] h-[18px] border-2 border-neutral-700 rounded-sm ui-checked:bg-blue-500 ui-checked:border-blue-500 transition-all"
        >
          <CheckIcon
            aria-hidden
            strokeWidth={3}
            className="text-white ui-not-checked:hidden"
          />
        </div>
        <span>종일</span>
      </Switch>
    </FormProvider>
  )
}
