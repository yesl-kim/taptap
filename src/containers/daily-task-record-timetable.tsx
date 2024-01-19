import { TaskWithRepeat, getTasksByDate } from '@/actions/task/get-tasks'
import { isEmpty } from '@/utils/validator'

import TaskTimetable, {
  TaskWithRepeatedTimes,
} from '@/components/task-timetable'
import TaskTimeBlock from './task-time-block/task-time-block'
import DateHeader from '@/components/date-header'

type Props = {
  date: Date
}

const DailyTaskRecordTimetable = async ({ date }: Props) => {
  const data = await getTasksByDate(date)
  if (!data.success) {
    throw data.error
  }

  const tasks = data.data
  const isAllday = (task: TaskWithRepeat) =>
    !task.repeat.times || isEmpty(task.repeat.times)
  const 기간이없는할일 = tasks.filter(isAllday)
  const 기간이있는할일 = tasks.filter(
    (t): t is TaskWithRepeatedTimes => !isAllday(t)
  )

  return (
    <div className="flex flex-col flex-1">
      <header className="h-[80px]">
        <DateHeader date={date} />
        <div>
          {기간이없는할일.map((task) => (
            <TaskTimeBlock key={task.id} task={task} date={date} />
          ))}
        </div>
      </header>
      <main className="flex-1 overflow-scroll">
        <TaskTimetable tasks={기간이있는할일} date={date} />
      </main>
    </div>
  )
}

export default DailyTaskRecordTimetable
