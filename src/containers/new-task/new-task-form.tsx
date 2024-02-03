'use client'

import { createTask } from '@/actions/task/create-task'

import TaskForm from '@/components/task-form/task-form'
import { useNewTaskContext } from './new-task-context'
import { NewTaskFormField } from './new-task-form.types'
import { repeatTypeValues } from '@/components/task-form/task-form.types'

const transform = (task: NewTaskFormField | null) => {
  if (!task) return

  const { category, startDate, time, ...rest } = task
  return {
    ...rest,
    category: category?.title,
    repeat: {
      type: repeatTypeValues.Values.None,
      data: { non: [{ startDate, times: [time] }] },
    },
  }
}

const NewTaskForm = () => {
  const { task } = useNewTaskContext()
  console.log('new task', task)
  const taskInput = transform(task)

  return <TaskForm action={createTask} task={taskInput} />
}

export default NewTaskForm
