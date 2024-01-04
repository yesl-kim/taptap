import { auth } from '@/lib/auth'

import TaskForm from '@/components/task-form/task-form'

export default async function TimerPage() {
  return (
    <main className="bg-white">
      timer page
      <TaskForm />
    </main>
  )
}
