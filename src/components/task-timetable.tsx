'use client'

import { Repeat, Task } from '@prisma/client'
import { Interval, format, parse } from 'date-fns'

import { TaskWithRepeat } from '@/actions/task/get-tasks'
import TaskTimeBlock from '@/containers/task-time-block/task-time-block'
import { Period, PeriodString } from '@/types/schema'

import Timetable from './time-table/timetable'

type RepeatWithTimes = Repeat & {
  times: PeriodString[]
}
export type TaskWithRepeatedTimes = TaskWithRepeat & {
  repeat: RepeatWithTimes
}

type Props = {
  tasks: TaskWithRepeatedTimes[]
  date: Date
}

const TaskTimetable = ({ tasks, date }: Props) => {
  const data = tasks.flatMap(({ repeat, ...t }) =>
    repeat.times.map((period) => {
      const newPeriod = Object.entries(period).reduce((parsed, cur) => {
        const [key, timestring] = cur
        const time = parse(timestring, 'HH:mm', date)
        return { ...parsed, [key]: time }
      }, {} as Period)
      return { ...t, time: newPeriod }
    })
  )

  return (
    <Timetable
      date={date}
      data={data}
      newBlock={(time) => (
        <div className="bg-blue-200">{format(time, 'hh:mm')}</div>
      )}
      renderItem={(task) => <TaskTimeBlock task={task} date={date} />}
    />
  )
}

export default TaskTimetable
