'use client'

import { ChangeEventHandler, memo, useCallback, useMemo, useState } from 'react'
import {
  eachMinuteOfInterval,
  endOfToday,
  startOfToday,
  format,
  addHours,
  roundToNearestMinutes,
  addMinutes,
} from 'date-fns'

export const getTimeOptions = ({
  start = startOfToday(),
  end = endOfToday(),
} = {}) =>
  eachMinuteOfInterval(
    {
      start,
      end,
    },
    { step: 30 }
  )

const formatTime = (date: Date): string => format(date, 'HH:mm')

interface Range {
  start: Date
  end: Date
}
const getDefaultTimes = (range: Range): Range => {
  const start = roundToNearestMinutes(addHours(range.start, 1), {
    nearestTo: 30,
    roundingMethod: 'ceil',
  })
  const end = addHours(start, 1)
  return { start, end }
}

interface Props extends Range {
  start: Date
  end: Date
  // delete: (idx: number) => void
}

// TODO: start, end 사이에만 선택할 수 있도록
// default value:
// - start: (props.start)를 30분 텀으로 반올림한 시간 + 1h
// - end: start + 1h
// options
// - start: props.start ~
// - end: start + 1m ~
// TODO: - start, end로 interval 만들기 (일단 30분 간격)
// TODO: 종료 시간 필드는 start보다 크도록 (최대 오늘의 마지막) - useToday 필요
// FIXME: drop down style

const STEP = 30
function TimeSelect({ start, end }: Props) {
  const [period, setPeriod] = useState<Range>(getDefaultTimes({ start, end }))
  const selectTime: ChangeEventHandler<HTMLSelectElement> = useCallback((e) => {
    const { name, value } = e.target
    setPeriod((prev) => ({ ...prev, [name]: new Date(value) }))
  }, [])

  return (
    <div className="flex">
      <div>
        <select
          name="start"
          value={period.start.toISOString()}
          onChange={selectTime}
        >
          {eachMinuteOfInterval(
            {
              start,
              end,
            },
            { step: STEP }
          ).map((time) => (
            <option key={time.toString()} value={time.toISOString()}>
              {format(time, 'HH:mm')}
            </option>
          ))}
        </select>
        <span>-</span>
        <select
          name="end"
          value={period.end.toISOString()}
          onChange={selectTime}
        >
          {eachMinuteOfInterval(
            {
              start: addMinutes(period.start, 1),
              end,
            },
            { step: STEP }
          ).map((time) => (
            <option key={time.toString()} value={time.toISOString()}>
              {format(time, 'HH:mm')}
            </option>
          ))}
        </select>
      </div>
      {/* <button type="button" >
        기간 삭제
      </button> */}
    </div>
  )
}

export default memo(TimeSelect)
