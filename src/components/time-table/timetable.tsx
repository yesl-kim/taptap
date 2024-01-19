'use client'

import { Interval, addMinutes, format } from 'date-fns'
import React, { MouseEventHandler, ReactNode, useState } from 'react'
import { ko } from 'date-fns/locale'

import useToday from '@/hooks/useToday'
import { round30Minutes } from '@/utils/datetime'
import { Period } from '@/types/schema'

import { HEIGHT_PER_STEP, TOTAL_HEIGHT } from './timetable.constants'
import {
  heightFloorToStep,
  heightToDuration,
  intervalToHeight,
} from './timetable.utils'
import TimetableGrid from './timetable-grid'

type TimeTableProps<T> = {
  date: Date
  data: T[]
  renderItem: (item: T) => ReactNode
  newBlock: (selectedTime: Date) => ReactNode
}

const Timetable = <T extends { time: Period }>({
  data,
  date,
  newBlock,
  renderItem,
}: TimeTableProps<T>) => {
  const { getStartOfDay } = useToday()
  const [offsetY, setOffsetY] = useState<null | number>(null)

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    setOffsetY(e.nativeEvent.offsetY)
  }

  const getSelectedTime = (offsetY: number) => {
    const duration = heightToDuration(offsetY)
    const time = addMinutes(getStartOfDay(date), duration)
    return round30Minutes(time, 'floor')
  }

  const timeToOffset = (time: Date | string | number) =>
    intervalToHeight({ start: getStartOfDay(date), end: time })

  return (
    <div className="relative bg-white" style={{ height: `${TOTAL_HEIGHT}px` }}>
      <div className="absolute inset-0" onClick={onClick}>
        {offsetY && (
          <div
            className="absolute inset-x-0"
            style={{
              top: heightFloorToStep(offsetY),
            }}
          >
            {newBlock(getSelectedTime(offsetY))}
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {data.map((item) => (
          <div
            key={`${item.time.start.toString()} ~ ${item.time.end.toString()}`}
            className={`absolute inset-x-0 flex pointer-events-auto`}
            style={{
              top: timeToOffset(item.time.start),
              height: intervalToHeight(item.time),
              minHeight: HEIGHT_PER_STEP,
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}

Timetable.Grid = TimetableGrid
export default Timetable
