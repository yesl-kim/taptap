'use client'

import { intervalToString } from '@/utils/datetime'

import { useNewTaskContext } from '../new-task-context'

const NewTaskPreview = () => {
  const { task } = useNewTaskContext()
  if (!task) return null // ??

  const { time, title, color } = task
  if (!time)
    return (
      <div
        className="flex-1 rounded border-[1px] border-gray-200 text-xs text-white drop-shadow-lg"
        style={{ background: color }}
      >
        <span>{title || '(제목 없음)'}</span>
      </div>
    )

  return (
    <div
      className="flex-1 rounded border-[1px] border-gray-200 text-xs text-white drop-shadow-lg"
      style={{ background: color }}
    >
      <span>{title || '(제목 없음)'}</span>
      <span>{intervalToString(time)}</span>
    </div>
  )
}

export default NewTaskPreview
