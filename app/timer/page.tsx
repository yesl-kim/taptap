import TimeSelect from '@/components/task-form/components/time-filed/time-select'
import TaskForm from '@/components/task-form/task-form'
import { auth } from '@/lib/auth'

export default async function TimerPage() {
  return (
    <main>
      timer page
      {/* <TaskForm /> */}
      <TimeSelect
        start={new Date('2023-12-12 09:00')}
        end={new Date('2023-12-12 18:00')}
        // delete={() => console.log('delete')}
      />
    </main>
  )
}
