'use client'

import { Repeat, Task } from '@prisma/client'
import { Interval, format, isSameDay } from 'date-fns'
import { z } from 'zod'

import { TaskWithRepeat } from '@/actions/task/get-tasks'
import TaskTimeBlock from '@/containers/task-time-block/task-time-block'
import {
  Period,
  PeriodString,
  categorySchema,
  repeatSchema,
  taskSchema,
} from '@/types/schema'
import { useNewTaskContext } from '@/containers/new-task/new-task-context'
import NewTaskTimeBlock from '@/containers/new-task/new-task-time-block/new-task-time-block'
import { periodStringToInterval, timestringForDBToDate } from '@/utils/datetime'

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
  const { task: newTask, create } = useNewTaskContext()
  const data = tasks.flatMap((task) => parse(task, date))

  const hasNewTask = newTask && isSameDay(newTask.startDate, date)

  return (
    <Timetable
      date={date}
      data={data}
      onCreate={(time) => {
        console.log(time)
        create(time)
      }}
      renderItem={(task) => <TaskTimeBlock task={task} date={date} />}
      newBlock={hasNewTask && <NewTaskTimeBlock />}
    />
  )
}

export default TaskTimetable

const parse = (value: any, date: Date) =>
  taskSchema
    .pick({
      title: true,
      color: true,
    })
    .extend({
      category: categorySchema.pick({ title: true }),
      repeat: repeatSchema
        .pick({
          startDate: true,
          times: true,
        })
        .required({ times: true }),
    })
    .transform(({ repeat, ...task }) =>
      repeat.times.map((period) => {
        const interval = periodStringToInterval(period, date)
        return { ...task, time: interval, editing: false }
      }),
    )
    .parse(value)
