'use client'

import { MouseEventHandler, useState } from 'react'
import { addMinutes } from 'date-fns'

import useToday from '@/hooks/useToday'

import { HEIGHT_PER_STEP } from './timetable.constants'

const Creator = () => {
  const { getStartOfDay } = useToday()
  const [offsetY, setOffsetY] = useState<null | number>(null)

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    setOffsetY(e.nativeEvent.offsetY)
  }

  const getY = (offsetY: number) =>
    Math.floor(offsetY / HEIGHT_PER_STEP) * HEIGHT_PER_STEP

  const getSelectedTime = (offsetY: number) => {
    const duration = Math.floor(offsetY / HEIGHT_PER_STEP) * STEP
    return addMinutes(getStartOfDay(date), duration)
  }

  return (
    <div className="absolute inset-0" onClick={onClick}>
      {offsetY && (
        <div
          className="absolute inset-x-0"
          style={{
            top: getY(offsetY) + 'px',
          }}
        >
          {newBlock(getSelectedTime(offsetY))}
        </div>
      )}
    </div>
  )
}
