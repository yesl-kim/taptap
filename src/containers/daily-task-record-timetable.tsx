import { getUnixTime } from 'date-fns'
import { Repeat } from '@prisma/client'

import { TaskWithRepeat, getTasksByDate } from '@/actions/task/get-tasks'
import { isEmpty } from '@/utils/validator'

import TaskTimetable, {
  TaskWithRepeatedTimes,
} from '@/components/task-timetable'
import DateHeader from '@/components/date-header'
import TaskList from './task-list'
import TimetableGrid from '@/components/time-table/timetable-grid'

type TaskWithoutTimes = TaskWithRepeat & {
  repeat: Repeat & { times?: null | [] }
}

type Props = {
  date: Date
}

const DailyTaskRecordTimetable = async ({ date }: Props) => {
  const data = await getTasksByDate(getUnixTime(date))
  if (!data.success) {
    throw data.error
  }

  const tasks = data.data
  const isAllday = (task: TaskWithRepeat): task is TaskWithoutTimes =>
    !task.repeat.times || isEmpty(task.repeat.times)
  const 기간이없는할일 = tasks.filter(isAllday)
  const 기간이있는할일 = tasks.filter(
    (t): t is TaskWithRepeatedTimes => !isAllday(t),
  )

  return (
    <section className="flex flex-1 flex-col bg-white">
      <header className="flex flex-col items-start gap-1 pl-20">
        <DateHeader date={date} />
        <div className="border-l-[1px] border-gray-200">
          <TaskList date={date} tasks={기간이없는할일} />
        </div>
        <div className="h-[1px] w-full shadow-[0px_1px_5px_1px_rgba(0,0,0,0.3)]" />
      </header>

      <div className="relative flex-1">
        <div className="absolute inset-0 overflow-scroll pl-20">
          <TimetableGrid />
          <TaskTimetable tasks={기간이있는할일} date={date} />
        </div>
      </div>
    </section>
  )
}

export default DailyTaskRecordTimetable
