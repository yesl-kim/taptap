'use client'

import { ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline'
import _ from 'lodash'
import {
  FormEventHandler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ZodType } from 'zod'
import { addHours, format } from 'date-fns'
import toast from 'react-hot-toast'
import Link from 'next/link'

import useToday from '@/hooks/useToday'
import { round30Minutes, setDateTime } from '@/utils/datetime'
import { createTask } from '@/actions/task/create-task'
import CategorySelect from '@/containers/category-select/category-select'
import { routes } from '@/constants/routes'

import TextInput from '@/components/text-input'
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
  newTaskFormOuputSchema,
} from '../new-task-form.types'
import { useNewTaskContext } from '../new-task-context'

type Error = {
  _errors: string[]
}

type Errors = {
  [key in keyof NewTaskFormField]?: Error
}

const NewTaskSimpleForm = () => {
  const { update, task: value, reset } = useNewTaskContext()
  const [errors, setErrors] = useState<Partial<Errors>>({})

  // TODO
  const validate = useCallback(
    (input: any, schema = newTaskFormInputSchema as ZodType) => {
      const verification = schema.safeParse(input)

      if (!verification.success) {
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

      return verification
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
    async (e) => {
      e.preventDefault()
      reset()

      const verification = newTaskFormOuputSchema.safeParse(value)
      if (!verification.success) {
        console.log(verification.error.format())
        setErrors(verification.error.format())
        return
      }

      const task = verification.data
      const action = createTask(task).then((res) => {
        if (!res.success) {
          throw res.error
        }
      })

      toast.promise(action, {
        loading: '저장 중...',
        success: '일정이 저장되었습니다.',
        error: (message) => message,
      })
    },
    [value, reset],
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

  const { getStartOfDay, getEndOfDay, today } = useToday()

  const isAllday = useMemo(() => !value?.time, [value?.time])
  const toggleAllday = useCallback(() => {
    if (!isAllday) {
      update({ time: null })
    } else {
      const start = round30Minutes(
        setDateTime({ date: value?.startDate ?? today, time: new Date() }),
      )
      const end = addHours(start, 1)
      update({ time: { start, end } })
    }
  }, [value?.startDate, update, today, isAllday])

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
                start: getStartOfDay(value.startDate),
                end: getEndOfDay(value.startDate),
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
        <Link
          href={routes.tasks.new}
          className="rounded bg-white p-2 text-sm text-gray-600 hover:text-gray-800 hover:brightness-95"
        >
          옵션 더보기
        </Link>
        <button className="rounded bg-blue-600 px-6 py-2 text-sm text-white hover:shadow-md hover:brightness-95">
          저장
        </button>
      </footer>
    </form>
  )
}

export default memo(NewTaskSimpleForm)
