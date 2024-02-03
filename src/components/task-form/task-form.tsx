'use client'

import { Controller, FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import _ from 'lodash'

import { responseSchema } from '@/types/api'
import useToday from '@/hooks/useToday'
import { defaultColorOptions } from '@/constants/task.constants'
import CategorySelect from '@/containers/category-select/category-select'

import ColorSelect from '../color-select/color-select'
import RepeatField from './repeat-field/repeat-field'
import {
  TaskFormField,
  TransformedTaskFrom,
  repeatTypeValues,
  taskFormSchema,
} from './task-form.types'
import TextInput from '../text-input'

const taskResponseSchema = responseSchema(z.NEVER)
type TaskResponse = z.infer<typeof taskResponseSchema>

type TaskFormProps = {
  action: (data: TransformedTaskFrom) => Promise<TaskResponse> // response 타입 통일?
  task?: Partial<TaskFormField> | null
}

const TaskForm = ({ action, task }: TaskFormProps) => {
  const { today } = useToday()

  const defaultValue = {
    color: defaultColorOptions[0],
    repeat: {
      type: repeatTypeValues.Values.None,
      data: {
        non: [
          {
            startDate: today,
          },
        ],
      },
    },
  }

  const context = useForm<TaskFormField, any, TransformedTaskFrom>({
    defaultValues: task ?? defaultValue,
    resolver: zodResolver(taskFormSchema),
    mode: 'onChange',
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = context

  const submit = async (task: TransformedTaskFrom) => {
    console.log('submit', task, errors)
    // const promise = action(task).then((res) => {
    //   if (!res.success) {
    //     throw res.error
    //   }
    // })

    // toast.promise(promise, {
    //   loading: '저장 중...',
    //   success: '일정이 저장되었습니다.',
    //   error: (message) => message,
    // })
  }

  return (
    <FormProvider {...context}>
      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-xl pl-24 pr-2 pt-2"
      >
        <header className="mb-6">
          <TextInput
            {...register('title')}
            onChange={(v) => setValue('title', v)}
            error={_.get(errors, 'title.message')}
            placeholder="제목"
          />
        </header>

        <Section Icon={ListBulletIcon}>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value, ...field } }) => (
                <CategorySelect
                  {...field}
                  value={{ title: value }}
                  onChange={(c) => onChange(c.title)}
                  error={_.get(errors, 'category.message')}
                />
              )}
            />

            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <ColorSelect
                  {...field}
                  error={_.get(errors, 'color.message')}
                />
              )}
            />
          </div>
        </Section>

        <Section Icon={ClockIcon}>
          <RepeatField />
        </Section>

        <footer className="mt-8 flex w-full justify-end py-2">
          <button
            type="submit"
            aria-disabled={isSubmitting}
            className="cursor-pointer rounded bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 hover:shadow-md"
          >
            완료
          </button>
        </footer>
      </form>
    </FormProvider>
  )
}

type Props = PropsWithChildren & {
  Icon: HeroIcon
}

const Section = ({ Icon, children }: Props) => (
  <section className="relative mb-2 flex w-full flex-col gap-2">
    <div className="absolute -left-12 top-0 flex h-9 w-9 items-center justify-center">
      <Icon aria-hidden className="w-4 text-gray-500" strokeWidth={2} />
    </div>
    {children}
  </section>
)

export default TaskForm
