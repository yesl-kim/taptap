'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { createTask } from '@/actions/create-task'
import { categoryCreateInputSchema } from '@/types/schema'

import ColorField from './color-field'
import RepeatField from './repeat-field/repeat-field'
import CategorySelect, { Category } from './category-select'
import { RepeatFormData } from './repeat-field/weekly-repeat-field'

const DATA = [
  { id: '1', title: 'category 1' },
  { id: '2', title: 'category 2' },
  { id: '3', title: 'category 3' },
]

// FIXME: type: use zod resolver
export type TaskFormData = {
  title: string
  color: string
  category: z.infer<typeof categoryCreateInputSchema>
  repeats: RepeatFormData[]
}

interface Props {
  categories: Category[]
  onSubmit: (data: TaskFormData) => void
}

// TODO: validation 로직 정리
export default function TaskForm({ categories, onSubmit }: Props) {
  const method = useForm<TaskFormData>({
    defaultValues: {
      repeats: [],
    },
  })
  const { handleSubmit, register } = method

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('title', { required: true })} placeholder="제목" />

        <div className="flex gap-2 items-center">
          <CategorySelect name="category" categories={categories} />
          <ColorField name="color" />
        </div>

        <RepeatField />
        <button type="submit">완료</button>
      </form>
    </FormProvider>
  )
}
