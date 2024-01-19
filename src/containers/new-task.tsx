import { createTask } from '@/actions/task/create-task'
import { getCategories } from '@/actions/get-categories'

import TaskForm from '@/components/task-form/task-form'

const NewTask = async () => {
  const categories = await getCategories()

  return <TaskForm categories={categories} action={createTask} />
}

export default NewTask
