'use client'

import { intervalToString } from '@/utils/datetime'

import { useNewTaskContext } from './new-task-context'

const NewTaskPreview = () => {
  const { task } = useNewTaskContext()

  // ???
  if (!task) return null

  return (
    <div
      className="rounded border-[1px] border-gray-200 text-xs text-white drop-shadow-lg"
      style={{ background: task.color }}
    >
      <span>{task.title || '(제목 없음)'}</span>
      {task.time ? <span>{intervalToString(task.time)}</span> : null}
    </div>
  )
}

export default NewTaskPreview
