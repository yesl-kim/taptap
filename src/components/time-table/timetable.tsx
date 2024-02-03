'use client'

import { addHours, addMinutes } from 'date-fns'
import React, {
  ForwardedRef,
  MouseEventHandler,
  ReactNode,
  forwardRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'

import useToday from '@/hooks/useToday'
import { round30Minutes } from '@/utils/datetime'
import { Period } from '@/types/schema'

import { HEIGHT_PER_STEP, TOTAL_HEIGHT } from './timetable.constants'
import { heightToDuration, intervalToHeight } from './timetable.utils'
import TimetableGrid from './timetable-grid'

type TimeTableProps<T> = {
  date: Date
  data: T[]
  renderItem: (item: T) => ReactNode
  newBlock?: ReactNode
  onCreate: (selectedDateTime: Date) => void
}

const Timetable = <T extends { time: Period }>({
  data,
  date,
  newBlock,
  renderItem,
  onCreate,
}: TimeTableProps<T>) => {
  const { getStartOfDay } = useToday()
  const [offsetY, setOffsetY] = useState<null | number>(null)

  const selectTime: MouseEventHandler<HTMLDivElement> = (e) => {
    const { offsetY } = e.nativeEvent
    const selectedTime = getSelectedTime(offsetY)
    onCreate(selectedTime)
  }

  const getSelectedTime = (offsetY: number) => {
    const duration = heightToDuration(offsetY)
    const time = addMinutes(getStartOfDay(date), duration)
    return round30Minutes(time, 'floor')
  }

  const timeToOffset = (time: Date | string | number) =>
    intervalToHeight({ start: getStartOfDay(date), end: time })

  return (
    <div
      className="relative overflow-hidden bg-white"
      style={{ height: `${TOTAL_HEIGHT}px` }}
    >
      <div className="absolute inset-0" onClick={selectTime} />

      <div className="pointer-events-none absolute inset-0">
        {data.map((item) => (
          <div
            key={`${item.time.start.toString()} ~ ${item.time.end.toString()}`}
            className={`pointer-events-auto absolute inset-x-0 flex`}
            style={{
              top: timeToOffset(item.time.start),
              height: intervalToHeight(item.time),
              minHeight: HEIGHT_PER_STEP,
            }}
          >
            {renderItem(item)}
          </div>
        ))}

        {newBlock}
      </div>
    </div>
  )
}

export default Timetable
