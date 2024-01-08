import { format } from 'date-fns'

import { createTask } from '@/actions/create-task'
import { getCategories } from '@/actions/get-categories'

import TaskForm from '@/components/task-form/task-form'

const NewTask = async () => {
  const categories = await getCategories()

  return (
    <div>
      <TaskForm categories={categories} action={createTask} />
    </div>
  )
}

export default NewTask

const timeFormat = (date: Date) => format(date, 'hh:mm')
