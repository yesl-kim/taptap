import { getUnixTime } from 'date-fns'

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
  const data = await getTasksByDate(getUnixTime(date))
  if (!data.success) {
    throw data.error
  }

  const tasks = data.data
  const isAllday = (task: TaskWithRepeat) =>
    !task.repeat.times || isEmpty(task.repeat.times)
  const 기간이없는할일 = tasks.filter(isAllday)
  const 기간이있는할일 = tasks.filter(
    (t): t is TaskWithRepeatedTimes => !isAllday(t),
  )

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="flex flex-col items-start border-b-[1px] border-gray-200">
        <DateHeader date={date} />
        <div className="mt-1 flex w-full flex-col items-stretch gap-0.5 px-0.5 py-1">
          {기간이없는할일.map((task) => (
            <TaskTimeBlock key={task.id} task={task} date={date} />
          ))}
        </div>
      </header>
      <main className="relative flex-1">
        <div className="absolute inset-0 overflow-scroll p-0.5">
          <TaskTimetable tasks={기간이있는할일} date={date} />
        </div>
      </main>
    </div>
  )
}

export default DailyTaskRecordTimetable
