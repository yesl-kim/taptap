'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline'
import { RepeatType } from '@prisma/client'
import toast from 'react-hot-toast'

import { responseSchema } from '@/types/api'
import useToday from '@/hooks/useToday'

import ColorSelect from '../color-select/color-select'
import RepeatField from './repeat-field/repeat-field'
import CategorySelect, { Category } from './category-select'
import {
  TaskFormField,
  TransformedTaskFrom,
  repeatTypeValues,
  taskFormSchema,
} from './taskform.types'
import TitleInput from '../text-input'

const taskResponseSchema = responseSchema(z.NEVER)
type TaskResponse = z.infer<typeof taskResponseSchema>

type TaskFormProps = {
  categories: Category[]
  action: (data: TransformedTaskFrom) => Promise<TaskResponse> // response 타입 통일?
  task?: TaskFormField
}

export default function TaskForm({ categories, action, task }: TaskFormProps) {
  const { today } = useToday()
  const defaultValue = {
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
    handleSubmit,
    formState: { errors, isSubmitting },
  } = context

  const submit = async (task: TransformedTaskFrom) => {
    console.log('submit', task, errors)
    const promise = action(task).then((res) => {
      if (!res.success) {
        throw res.error
      }
    })

    toast.promise(promise, {
      loading: '저장 중...',
      success: '일정이 저장되었습니다.',
      error: (message) => message,
    })
  }

  return (
    <FormProvider {...context}>
      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-xl pl-24 pr-2 pt-2"
      >
        <header className="mb-6">
          <TitleInput name="title" />
        </header>
        <Section Icon={ListBulletIcon}>
          <div className="flex items-center gap-2">
            <ColorSelect name="color" />
            <CategorySelect name="category" categories={categories} />
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
