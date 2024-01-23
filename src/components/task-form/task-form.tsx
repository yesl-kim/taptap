'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addHours, format } from 'date-fns'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Prisma } from '@prisma/client'

import {
  categoryCreateInputSchema,
  taskCreateInputSchema,
  categoryUpdateInputSchema,
  repeatCreateInputSchema,
  periodDateSchema,
  taskSchema,
} from '@/types/schema'
import { responseSchema } from '@/types/api'
import useToday from '@/hooks/useToday'

import ColorSelect from './color-select'
import RepeatField from './repeat-field/repeat-field'
import CategorySelect, { Category } from './category-select'

const repeatWithDateTimesSchema = repeatCreateInputSchema.extend({
  times: z.nullable(z.array(periodDateSchema)),
})

const taskFormSchema = taskCreateInputSchema.extend({
  category: categoryCreateInputSchema,
  repeats: z.array(repeatWithDateTimesSchema),
})

const taskFormResolver = taskFormSchema.extend({
  repeats: z.array(
    repeatWithDateTimesSchema.extend({
      times: z.optional(
        z.array(
          periodDateSchema.transform(({ start, end }) => ({
            start: format(start, 'hh:mm'),
            end: format(end, 'hh:mm'),
          }))
        )
      ),
    })
  ),
})

export type TaskFormData = z.infer<typeof taskFormSchema>
type parsedTaskFormData = z.infer<typeof taskFormResolver>
const taskResponseSchema = responseSchema(z.NEVER)
type TaskResponse = z.infer<typeof taskResponseSchema>

type TaskFormProps = {
  categories: Category[]
  action: (data: parsedTaskFormData) => Promise<TaskResponse> // response 타입 통일?
  task?: TaskFormData
}

export default function TaskForm({ categories, action, task }: TaskFormProps) {
  const context = useForm<TaskFormData>({
    defaultValues: task,
    resolver: zodResolver(taskFormResolver),
  })
  console.log('task: ', task)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = context

  // TODO: error, loading, ... manage foram state
  const submit = async (task: parsedTaskFormData) => {
    console.log(task, errors)
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
        className="pl-24 pr-2 pt-2 max-w-xl"
      >
        <header className="mb-6">
          <input
            {...register('title')}
            placeholder="제목"
            className="text-2xl tracking-widest text-gray-600 placeholder:text-gray-600 border-b-[1px] border-b-gray-200 focus:border-b-2 focus:border-b-blue-600 transition-all focus:outline-none outline-none"
          />
        </header>
        <Section Icon={CalendarIcon}>
          <div className="flex gap-2 items-center">
            <ColorSelect name="color" />
            <CategorySelect name="category" categories={categories} />
          </div>
        </Section>
        <Section Icon={ClockIcon}>
          <RepeatField />
        </Section>
        <footer className="flex justify-end mt-8 py-2 w-full">
          <button
            type="submit"
            aria-disabled={isSubmitting}
            className="py-2 px-6 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm cursor-pointer hover:shadow-md"
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
  <section className="relative flex flex-col gap-2 w-full mb-2">
    <div className="absolute top-0 -left-12 w-9 h-9 flex items-center justify-center">
      <Icon aria-hidden className="w-4 text-gray-500" strokeWidth={2} />
    </div>
    {children}
  </section>
)
