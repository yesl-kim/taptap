import { useEffect } from 'react'
import {
  useFieldArray,
  useFormContext,
  Controller,
  useController,
} from 'react-hook-form'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu } from '@headlessui/react'
import { format, isSameDay } from 'date-fns'
import _ from 'lodash'

import { nestedValue } from '@/utils/parser'
import { isEmpty } from '@/utils/validator'
import useToday from '@/hooks/useToday'

import IconButton from '@/components/icon-button'
import PeriodFields from '@/components/period-fields'
import Calendar from '@/components/calendar/calendar'
import { RepeatFormData } from './weekly-repeat-field'
import DateSelect from '@/components/date-select'
import { TaskFormField } from '../taskform.types'
import ErrorWrapper from '../error-wrapper'

interface Props {
  name: string
}

const name = 'repeat.data.non' as const
const NonRepeatField = () => {
  const { today } = useToday()

  const {
    control,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext<TaskFormField>()

  const { fields, append, remove } = useFieldArray<TaskFormField>({
    control,
    name,
  })

  const values = watch(name)
  const repeatFields = fields.map((field, i) => ({ ...field, ...values[i] }))

  useEffect(() => {
    trigger(name)
  }, [values, trigger])

  return (
    <ErrorWrapper error={errors} path={`${name}.message`}>
      <div>
        {repeatFields.map(({ id, times }, i) => (
          <ErrorWrapper
            key={id}
            error={errors}
            path={`${name}.${i}.startDate.message`}
            className="mb-2 last:mb-0"
          >
            <div className="flex gap-2">
              <Controller
                control={control}
                name={`${name}.${i}.startDate`}
                render={({ field: startDate }) => <DateSelect {...startDate} />}
              />

              <PeriodFields name={`${name}.${i}.times`} />

              {_.isEmpty(times) && (
                <div className="flex h-[40px] items-center">
                  <IconButton
                    Icon={XMarkIcon}
                    label="이날 일정 삭제"
                    onClick={() => remove(i)}
                  />
                </div>
              )}
            </div>
          </ErrorWrapper>
        ))}
      </div>
      <Menu as="div" className="relative">
        <Menu.Button
          type="button"
          className="p-2 rounded text-blue-600 text-sm hover:bg-blue-50/70"
        >
          날짜 추가
        </Menu.Button>
        <Menu.Items className="absolute mt-2 bg-white z-10 pb-2 shadow-md rounded">
          <Menu.Item>
            {({ close }) => (
              <Calendar
                selectedDate={today}
                onChange={(date) => {
                  append({ startDate: date, times: [] })
                  close()
                }}
              />
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </ErrorWrapper>
  )
}

export default NonRepeatField
