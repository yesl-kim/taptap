'use client'

import { intervalToPercentageOfDay } from '@/utils/datetime'
import useToday from '@/hooks/useToday'

import NewTaskPreview from './new-task-preview'
import PopoverPanelLayout from '@/components/popover-panel-layout'
import NewTaskForm from './new-task-form'
import { useNewTaskContext } from '../new-task-context'

/*
[ ] 위치
*/
const NewTaskTimeBlock = () => {
  const { getStartOfDay } = useToday()
  const { reset, task } = useNewTaskContext()
  if (!task) return null

  const { startDate, time } = task
  if (!time)
    return (
      <div className="pointer-events-auto z-20 flex brightness-100">
        <NewTaskPreview />
        <div className="absolute">
          <PopoverPanelLayout close={reset}>
            <NewTaskForm />
          </PopoverPanelLayout>
        </div>
      </div>
    )

  const top = intervalToPercentageOfDay({
    start: getStartOfDay(startDate),
    end: time.start,
  })

  const height = intervalToPercentageOfDay(time)

  console.log('top: ', top)

  return (
    <div
      className="pointer-events-auto absolute inset-x-0 z-20 flex brightness-100"
      style={{ top: `${top}%`, height: `${height}%` }}
    >
      <NewTaskPreview />
      <div className="absolute">
        <PopoverPanelLayout close={reset}>
          <NewTaskForm />
        </PopoverPanelLayout>
      </div>
    </div>
  )
}

export default NewTaskTimeBlock
