'use client'

import { addMinutes, eachMinuteOfInterval, format } from 'date-fns'
import { MouseEventHandler, useState } from 'react'

import useToday from '@/hooks/useToday'
import useBoolean from '@/hooks/useBoolean'

const HEIGHT = 48
const $30_MINUTES_HEIGHT = HEIGHT / 2
const HEIGHT_PER_BLOCK = HEIGHT / 2 + 'px'

type TimeTableProps = {
  date: Date
  newBlock: (selectedTime: Date) => React.ReactNode
}

//? 선은 어디서 렌더해야되지
// offset y -> duration (분) -> 30분 내림 계산
// 1분 = 48 / 60

// TODO: height 단위 정리
const Timetable = ({ date, newBlock }: TimeTableProps) => {
  const { getStartOfDay } = useToday()

  const totalHeight = HEIGHT * 24 + 'px'
  const [offsetY, setOffsetY] = useState<null | number>(null)

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    setOffsetY(e.nativeEvent.offsetY)
  }

  const getY = (offsetY: number, step = 30) => {
    const heightPerStep = HEIGHT / (60 / step)
    return Math.floor(offsetY / heightPerStep) * heightPerStep
  }

  // reducer를 쓰는게 더 깔끔하려나
  const getSelectedTime = (offsetY: number, step = 30) => {
    const heightPerStep = HEIGHT / (60 / step)
    const duration = Math.floor(offsetY / heightPerStep) * step
    const time = addMinutes(getStartOfDay(date), duration)
    return time
  }

  return (
    <div className="relative bg-white" style={{ height: totalHeight }}>
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
