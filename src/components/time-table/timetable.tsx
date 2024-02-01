'use client'

import { addHours, addMinutes } from 'date-fns'
import React, { MouseEventHandler, ReactNode, useState } from 'react'
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

/*
 NOTE: params type = taskFormData
 */

const Timetable = <T extends { time: Period }>({
  data,
  date,
  newBlock,
  renderItem,
  onCreate,
}: TimeTableProps<T>) => {
  const { getStartOfDay } = useToday()
  const [offsetY, setOffsetY] = useState<null | number>(null)

  const router = useRouter()

  const selectTime: MouseEventHandler<HTMLDivElement> = (e) => {
    const { offsetY } = e.nativeEvent
    const selectedTime = getSelectedTime(offsetY)
    onCreate(selectedTime)
    // const state = {
    //   repeats: [
    //     {
    //       startDate: date,
    //       times: [{ start: selectedTime, end: addHours(selectedTime, 1) }],
    //     },
    //   ],
    // }
    // const params = new URLSearchParams({
    //   state: encodeURIComponent(JSON.stringify(state)),
    // })
    // router.push(`/taskedit?${params.toString()}`)
  }

  // const selectTime: MouseEventHandler<HTMLDivElement> = (e) => {
  //   setOffsetY(e.nativeEvent.offsetY)
  // }

  const getSelectedTime = (offsetY: number) => {
    const duration = heightToDuration(offsetY)
    const time = addMinutes(getStartOfDay(date), duration)
    return round30Minutes(time, 'floor')
  }

  const timeToOffset = (time: Date | string | number) =>
    intervalToHeight({ start: getStartOfDay(date), end: time })

  return (
    <div className="relative bg-white" style={{ height: `${TOTAL_HEIGHT}px` }}>
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
        {/* <div
          data-visible={!!offsetY}
          className="absolute inset-x-0 top-0 hidden data-[visible=true]:block pointer-events-none"
          style={{
            transform: `translateY(${heightFloorToStep(offsetY ?? 0)}px)`,
          }}
        >
          {newBlock(getSelectedTime(offsetY ?? 0))}
        </div> */}
      </div>
    </div>
  )
}

Timetable.Grid = TimetableGrid
export default Timetable
