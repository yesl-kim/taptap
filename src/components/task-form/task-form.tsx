'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

import {
  categoryCreateInputSchema,
  taskCreateInputSchema,
  categoryUpdateInputSchema,
  repeatCreateInputSchema,
  periodDateSchema,
} from '@/types/schema'

import ColorSelect from './color-select'
import RepeatField from './repeat-field/repeat-field'
import CategorySelect, { Category } from './category-select'

const taskFormSchema = taskCreateInputSchema.extend({
  category: z.union([categoryCreateInputSchema, categoryUpdateInputSchema]),
  repeats: z.array(
    repeatCreateInputSchema.extend({
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

type TaskFormData = z.infer<typeof taskFormSchema>

interface TaskFormProps {
  categories: Category[]
  action: (data: TaskFormData) => void
}

export default function TaskForm({ categories, action }: TaskFormProps) {
  const context = useForm<TaskFormData>({
    defaultValues: {
      category: {},
      repeats: [],
    },
    resolver: zodResolver(taskFormSchema),
  })

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = context

  // TODO: error, loading, ... manage foram state
  const submit = async (task: TaskFormData) => {
    console.log('task in form', task)
    const result = await action(task)
    console.log('result: ', result)
  }

  console.log('errors: ', errors)
  console.log('isSubmitting: ', isSubmitting)

  return (
    <FormProvider {...context}>
      <form onSubmit={handleSubmit(submit)} className="pl-24 pr-2 pt-2">
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
            disabled={isSubmitting}
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
  <section className="relative flex flex-col gap-2 w-full mb-2 pb-2 border-b-[1px] border-b-gray-200 last-of-type:border-b-0">
    <div className="absolute top-0 -left-12 w-9 h-9 flex items-center justify-center">
      <Icon aria-hidden className="w-4 text-gray-500" strokeWidth={2} />
    </div>
    {children}
  </section>
)
