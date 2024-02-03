'use client'

import {
  useFloating,
  autoPlacement,
  shift,
  flip,
  autoUpdate,
} from '@floating-ui/react-dom'

import { intervalToPercentageOfDay } from '@/utils/datetime'
import useToday from '@/hooks/useToday'

import NewTaskPreview from './new-task-preview'
import PopoverPanelLayout from '@/components/popover-panel-layout'
import NewTaskForm from './new-task-simple-form'
import { useNewTaskContext } from '../new-task-context'
import Portal from '@/components/portal'

const NewTaskTimeBlock = () => {
  const { getStartOfDay } = useToday()
  const { reset, task } = useNewTaskContext()
  const { refs, floatingStyles } = useFloating({
    placement: 'left',
    strategy: 'fixed',
    middleware: [shift(), autoPlacement(), flip()],
    whileElementsMounted: autoUpdate,
  })

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
  console.log(height)

  return (
    <div
      className="pointer-events-none absolute inset-0 transition-transform"
      style={{ transform: `translateY(${top}%)` }}
    >
      <div
        className="transition-height pointer-events-auto absolute inset-x-0 top-0 flex brightness-100"
        style={{ height: `${height}%` }}
        ref={refs.setReference}
      >
        <NewTaskPreview />
      </div>
      <Portal>
        <div ref={refs.setFloating} style={floatingStyles}>
          <PopoverPanelLayout close={reset}>
            <NewTaskForm />
          </PopoverPanelLayout>
        </div>
      </Portal>
    </div>
  )
}

export default NewTaskTimeBlock
