'use client'

import { Controller, FormProvider, useForm } from 'react-hook-form'
import { endOfDay } from 'date-fns'
import { ListBulletIcon, ClockIcon } from '@heroicons/react/24/outline'

import TextInput from '@/components/text-input'
import CategorySelect from '@/components/task-form/category-select'
import ColorSelect from '@/components/color-select/color-select'
import PeriodField from '@/components/period-field'
import ListItem from '@/components/list-item'
import DateSelect from '@/components/date-select'
import { NewTaskFormValue, NewTaskFormField } from './new-task-form.types'
import PopoverPanelLayout from '@/components/popover-panel-layout'

const NewTaskForm = () => {
  const context = useForm<NewTaskFormField, null, NewTaskFormValue>({
    defaultValues: {},
  })

  const { control } = context

  return (
    <FormProvider {...context}>
      <form className="flex flex-col bg-white p-2">
        <div className="mb-6 pl-16">
          <TextInput name="title" placeholder="제목" />
        </div>
        <ListItem
          before={<ListBulletIcon strokeWidth={2} className="text-gray-500" />}
        >
          <div className="flex gap-2">
            <CategorySelect categories={[]} name="category" />
            <ColorSelect name="color" />
          </div>
        </ListItem>
        <ListItem
          before={<ClockIcon strokeWidth={2} className="text-gray-500" />}
        >
          <div className="flex gap-4">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => <DateSelect {...field} />}
            />
            <PeriodField
              name="time"
              range={{ start: new Date(), end: endOfDay(new Date()) }}
            />
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
    </FormProvider>
  )
}

export default NewTaskForm
