'use client'

import { useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCallback } from 'react'

import { createTask } from '@/actions/task/create-task'

import TaskForm from '@/components/task-form/task-form'
import { useNewTaskContext } from './new-task-context'
import { NewTaskFormField } from './new-task-form.types'
import {
  TaskFormField,
  TransformedTaskFrom,
  repeatTypeValues,
} from '@/components/task-form/task-form.types'
import IconButton from '@/components/icon-button'

const transform = (task: NewTaskFormField | null) => {
  if (!task) return

  const { startDate, time, ...rest } = task
  return {
    ...rest,
    repeat: {
      type: repeatTypeValues.Values.None,
      data: { non: [{ startDate, times: [time] }] },
    },
  }
}

const NewTaskForm = () => {
  const { task, reset } = useNewTaskContext()
  const taskInput = transform(task) as Partial<TaskFormField>

  const router = useRouter()
  const action = async (data: TransformedTaskFrom) => {
    router.back()
    reset()
    return await createTask(data)
  }

  const goBack = useCallback(() => {
    reset()
    router.back()
  }, [router, reset])

  return (
    <section className="relative bg-white py-6 pr-4">
      <TaskForm action={action} task={taskInput} />

      <aside className="absolute left-0 top-0 w-[max-content] p-2">
        <IconButton Icon={XMarkIcon} label="닫기" onClick={goBack} />
      </aside>
    </section>
  )
}

export default NewTaskForm
