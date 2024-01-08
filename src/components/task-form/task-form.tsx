'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'

import {
  categoryCreateInputSchema,
  taskCreateInputSchema,
  categoryUpdateInputSchema,
  repeatCreateInputSchema,
  periodDateSchema,
} from '@/types/schema'

import ColorField from './color-field'
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
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
  } = context

  // TODO: error, loading, ... manage foram state
  const submit = async (task: TaskFormData) => {
    console.log('task in form', task)
    const result = await action(task)
    console.log('result: ', result)
  }

  console.log('errors: ', errors)
  console.log(
    'isLoading, isSubmitSuccessful, isSubmitting: ',
    isLoading,
    isSubmitSuccessful,
    isSubmitting
  )

  return (
    <FormProvider {...context}>
      <form onSubmit={handleSubmit(submit)}>
        <input {...register('title', { required: true })} placeholder="제목" />

        <div className="flex gap-2 items-center">
          <CategorySelect name="category" categories={categories} />
          <ColorField name="color" />
        </div>

        <RepeatField />
        <button type="submit" disabled={isSubmitting}>
          완료
        </button>
      </form>
    </FormProvider>
  )
}
