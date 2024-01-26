import { useEffect } from 'react'
import { useFieldArray, useFormContext, Controller } from 'react-hook-form'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Menu } from '@headlessui/react'
import { format, isSameDay } from 'date-fns'

import { nestedValue } from '@/utils/parser'
import { isEmpty } from '@/utils/validator'
import useToday from '@/hooks/useToday'

import IconButton from '@/components/icon-button'
import PeriodFields from '@/components/period-fields'
import Calendar from '@/components/calendar/calendar'
import { RepeatFormData } from './weekly-repeat-field'

interface Props {
  name: string
}

const NonRepeatField = ({ name }: Props) => {
  const { today } = useToday()
  const {
    control,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    shouldUnregister: true,
  })

  const value: RepeatFormData[] = watch(name, [])
  useEffect(() => {
    trigger(name)
  }, [value, trigger, name])

  return (
    <div>
      <div>
        {fields.map((field, i) => {
          const errorMessage = nestedValue(
            `${name}.${i}.startDate.message`,
            errors
          )
          return (
            <div key={field.id} className="mb-2 last:mb-0">
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name={`${name}.${i}.startDate`}
                  defaultValue={today}
                  render={({ field: startDate }) => (
                    <Menu as="div" className="relative">
                      <Menu.Button className="px-3 py-2 rounded transition-all outline-none focus:outline-none focus:bg-neutral-200 text-sm text-gray-600 hover:bg-neutral-100">
                        {format(startDate.value, 'yyyy년 M월 d일')}
                      </Menu.Button>
                      <Menu.Items className="absolute mt-2 bg-white z-10 pb-2 shadow-md rounded">
                        <Menu.Item>
                          {({ close }) => (
                            <Calendar
                              selectedDate={startDate.value}
                              onChange={(date) => {
                                startDate.onChange(date)
                                close()
                              }}
                            />
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  )}
                />

                <PeriodFields name={`${name}.${i}.times`} />
                {isEmpty(nestedValue(`${i}.times`, value)) ? (
                  <div className="flex h-[40px] items-center">
                    <IconButton
                      Icon={XMarkIcon}
                      label="이날 일정 삭제"
                      onClick={() => remove(i)}
                    />
                  </div>
                ) : null}
              </div>
              {errorMessage && (
                <p className="ml-3 pt-1 text-xs text-red-600">{errorMessage}</p>
              )}
            </div>
          )
        })}
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
    </div>
  )
}

export default NonRepeatField
