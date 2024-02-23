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
import TimetableContainer from '@/components/time-table/timetable-container'

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
      <header className="flex flex-col items-stretch gap-1 pl-20">
        <div className="self-start">
          <DateHeader date={date} />
        </div>
        <div className="border-l-[1px] border-gray-200">
          <TaskList date={date} tasks={기간이없는할일} />
        </div>
      </header>

      <div className="flex-1">
        <TimetableContainer>
          <TimetableGrid />
          <TaskTimetable tasks={기간이있는할일} date={date} />
        </TimetableContainer>
      </div>
    </section>
  )
}

export default DailyTaskRecordTimetable
