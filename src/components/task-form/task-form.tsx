'use client'

import { FormProvider, useForm } from 'react-hook-form'

import { createTask } from '@/actions/create-task'

import ColorField from './color-field'
import RepeatField from './repeat-field/repeat-field'
import CategorySelect from './category-select'

const DATA = [
  { id: '1', title: 'category 1' },
  { id: '2', title: 'category 2' },
  { id: '3', title: 'category 3' },
]

export default function TaskForm() {
  const method = useForm({
    defaultValues: {
      repeats: [],
    },
  })
  const { handleSubmit } = method
  const onSubmit = (data: any) => {
    console.log(data)
    const task = {
      title: 'test',
      color: '#000',
      categoryId: 'clqxp3x5k0000gox2jmx71vs5',
      repeats: [
        {
          startDate: new Date(),
        },
      ],
    }
    createTask(task)
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="title" required placeholder="제목" />

        <div className="flex gap-2 items-center">
          <CategorySelect name="categoryId" categories={DATA} />
          <ColorField />
        </div>

        <RepeatField />
        <button type="submit">완료</button>
      </form>
    </FormProvider>
  )
}
