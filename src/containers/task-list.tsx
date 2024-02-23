'use client'

import { memo, use } from 'react'
import _ from 'lodash'
import { Repeat } from '@prisma/client'
import { isSameDay } from 'date-fns'

import { TaskWithRepeat } from '@/actions/task/get-tasks'
import NewTaskTimeBlock from '@/containers/new-task/new-task-time-block/new-task-time-block'

import { useNewTaskContext } from './new-task/new-task-context'
import TaskTimeBlock from './task-time-block/task-time-block'

type Task = TaskWithRepeat & { repeat: Repeat & { times?: null | [] } }

type Props = {
  date: Date
  tasks: Task[]
}

const TaskList = ({ date, tasks }: Props) => {
  const { task: newTask } = useNewTaskContext()
  const hasNewTask =
    newTask && !newTask.time && isSameDay(newTask.startDate, date)

  return (
    <div className="flex w-full flex-col items-stretch gap-0.5 px-0.5 py-0.5">
      {tasks.map((task) => (
        <TaskTimeBlock key={task.id} task={task} date={date} />
      ))}
      {hasNewTask && <NewTaskTimeBlock />}
    </div>
  )
}

export default memo(TaskList)
