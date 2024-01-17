'use client'

import { addMinutes } from 'date-fns'
import { MouseEventHandler, useState } from 'react'

import useToday from '@/hooks/useToday'

import { HEIGHT_PER_STEP, STEP, TOTAL_HEIGHT } from './timetable.constants'

type TimeTableProps = {
  date: Date
  newBlock: (selectedTime: Date) => React.ReactNode
}

//? 선은 어디서 렌더해야되지
const Timetable = ({ date, newBlock }: TimeTableProps) => {
  const { getStartOfDay } = useToday()
  const [offsetY, setOffsetY] = useState<null | number>(null)

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    setOffsetY(e.nativeEvent.offsetY)
  }

  const getY = (offsetY: number) =>
    Math.floor(offsetY / HEIGHT_PER_STEP) * HEIGHT_PER_STEP

  const getSelectedTime = (offsetY: number) => {
    const duration = Math.floor(offsetY / HEIGHT_PER_STEP) * STEP
    const time = addMinutes(getStartOfDay(date), duration)
    return time
  }

  return (
    <div className="relative bg-white" style={{ height: `${TOTAL_HEIGHT}px` }}>
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
    </div>
  )
}

export default Timetable
