'use client'

import { ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline'
import _ from 'lodash'
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ZodType } from 'zod'
import { addHours } from 'date-fns'

import useToday from '@/hooks/useToday'
import { round30Minutes } from '@/utils/datetime'

import TextInput from '@/components/text-input'
import CategorySelect from '@/components/task-form/category-select'
import ColorSelect from '@/components/color-select/color-select'
import PeriodField from '@/components/period-field'
import ListItem from '@/components/list-item'
import DateSelect from '@/components/date-select'
import FieldError from '@/components/field-error'
import Checkbox from '@/components/checkbox'
import {
  NewTaskFormField,
  newTaskFormFieldSchema,
  newTaskFormInputSchema,
} from '../new-task-form.types'
import { useNewTaskContext } from '../new-task-context'

type Error = {
  _errors: string[]
}

type Errors = {
  [key in keyof NewTaskFormField]?: Error
}

const NewTaskForm = () => {
  const { update, task: value } = useNewTaskContext()
  const [errors, setErrors] = useState<Partial<Errors>>({})

  const validate = useCallback(
    (input: any, schema = newTaskFormInputSchema as ZodType) => {
      const verification = schema.safeParse(input)
      const isValid = verification.success

      if (!isValid) {
        setErrors((prev) => ({ ...prev, ...verification.error.format() }))
      } else {
        setErrors((prev) => {
          const newErrors = {} as Errors

          for (const [key, error] of Object.entries(prev)) {
            if (key in input) continue
            newErrors[key as keyof NewTaskFormField] = error
          }

          return newErrors
        })
      }

      return isValid
    },
    [],
  )

  const onChange = useCallback(
    (name: keyof NewTaskFormField) => (v: any) => {
      const value = { [name]: v }
      update(value)
      validate(value)
    },
    [update, validate],
  )

  const submit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault()
      const isValid = validate(value, newTaskFormFieldSchema)
      if (!isValid) return

      console.log('submit')
    },
    [validate, value],
  )

  const timeError = useMemo(
    () =>
      ['start', 'end'].reduce(
        (error, key) => ({
          ...error,
          [key]: _.get(errors, `time.${key}._errors.0`),
        }),
        {} as { [key in 'start' | 'end']?: string },
      ),
    [errors],
  )

  const isAllday = useMemo(() => !value?.time, [value])
  const prevTime = useRef<NewTaskFormField['time']>(value?.time)
  const toggleAllday = () => {
    if (!isAllday) {
      prevTime.current = value?.time
      update({ time: null })
    } else {
      const start = round30Minutes(new Date())
      const end = addHours(start, 1)
      const time = prevTime.current ?? { start, end }
      update({ time })
    }
  }

  const { getStartOfDay, getEndOfDay } = useToday()

  return (
    <form className="flex flex-col bg-white p-2" onSubmit={submit}>
      <div className="mb-6 pl-16">
        <TextInput
          value={value?.title}
          onChange={onChange('title')}
          placeholder="제목"
          error={_.get(errors, 'title._errors.0')}
        />
      </div>
      <ListItem
        before={<ListBulletIcon strokeWidth={2} className="text-gray-500" />}
      >
        <div className="flex gap-2">
          <div>
            <CategorySelect
              categories={[]}
              value={value?.category}
              onChange={onChange('category')}
              error={_.get(errors, 'category._errors.0')}
            />
          </div>

          <ColorSelect
            value={value?.color}
            onChange={onChange('color')}
            error={_.get(errors, 'color._errors.0')}
          />
        </div>
      </ListItem>

      <ListItem
        before={<ClockIcon strokeWidth={2} className="text-gray-500" />}
      >
        <div className="flex items-center gap-4">
          <DateSelect
            value={value?.startDate}
            onChange={onChange('startDate')}
          />
          {!value?.time ? (
            <p className="self-start px-2 text-sm leading-[40px] text-gray-500">
              기간 설정 안함
            </p>
          ) : (
            <PeriodField
              value={value.time}
              onChange={onChange('time')}
              range={{
                start: getStartOfDay(new Date()),
                end: getEndOfDay(new Date()),
              }}
              errors={timeError}
            />
          )}
        </div>
        <div className="mt-1 pl-1">
          <FieldError message={_.get(errors, 'startDate._errors.0')} />
        </div>

        <div>
          <Checkbox checked={isAllday} onChange={toggleAllday} label="종일" />
        </div>
      </ListItem>

      <footer className="mt-8 flex items-center justify-end gap-2">
        <button
          type="button"
          className="rounded bg-white p-2 text-sm text-gray-600 hover:text-gray-800 hover:brightness-95"
        >
          옵션 더보기
        </button>
        <button className="rounded bg-blue-600 px-6 py-2 text-sm text-white hover:shadow-md hover:brightness-95">
          저장
        </button>
      </footer>
    </form>
  )
}

export default NewTaskForm
