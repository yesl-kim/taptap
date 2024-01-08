import { format } from 'date-fns'

import { createTask } from '@/actions/create-task'
import { getCategories } from '@/actions/get-categories'

import TaskForm, { TaskFormData } from '@/components/task-form/task-form'

const newTask = async () => {
  const categories = await getCategories()

  const _createTask = async (data: TaskFormData) => {
    try {
      const repeats = data.repeats.map((repeat) => ({
        ...repeat,
        times: repeat.times.map(({ start, end }) => ({
          start: timeFormat(start),
          end: timeFormat(end),
        })),
      }))
      const taskData = { ...data, repeats }
      await createTask(taskData)
    } catch (error) {
      alert(error)
    }
  }

  return (
    <div>
      <TaskForm categories={categories} onSubmit={_createTask} />
    </div>
  )
}

export default newTask

const timeFormat = (date: Date) => format(date, 'hh:mm')
