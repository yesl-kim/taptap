import { ko } from 'date-fns/locale'
import {
  Interval,
  RoundingMethod,
  differenceInMinutes,
  format,
  getDate,
  getMonth,
  getYear,
  parse,
  roundToNearestMinutes,
  set,
} from 'date-fns'

import { timestringSchema, Period, PeriodString } from '@/types/schema'

const STEP = 30
export const round30Minutes = (
  time: Date,
  roundingMethod = 'ceil' as RoundingMethod,
) =>
  roundToNearestMinutes(time, {
    nearestTo: STEP,
    roundingMethod,
  })

/*
NOTE
- 시간을 다룰 때의 타입
- date: client 측에서 데이터를 다룰 때의 타입, Date 객체
- timestring: DB 저장시 사용되는 타입, HH:mm 형태의 문자열
 */

export const dateToTimestringForDB = (date: Date) => format(date, 'HH:mm')
export const timestringForDBToDate = (timestring: string, date: Date) =>
  parse(timestringSchema.parse(timestring), 'HH:mm', date)

export const periodStringToInterval = (period: PeriodString, date: Date) =>
  Object.entries(period).reduce((parsed, cur) => {
    const [key, timestring] = cur
    const time = timestringForDBToDate(timestring, date)
    return { ...parsed, [key]: time }
  }, {} as Period)

export const intervalToString = ({ start, end }: Period) => {
  const [startHalfDay, endHalfDay] = [start, end].map((time) =>
    format(time, 'aaa', { locale: ko }),
  )
  const [startString, endString] = [start, end].map((time) =>
    format(time, 'h:mm'),
  )

  if (startHalfDay === endHalfDay) {
    return `${startHalfDay} ${startString} ~ ${endString}`
  } else {
    return `${startHalfDay} ${startString} ~ ${endHalfDay} ${endString}`
  }
}

export const intervalToPercentageOfDay = ({ start, end }: Interval) => {
  const $1DAY_MINUTE = 24 * 60
  const duration = differenceInMinutes(end, start)
  return Math.floor((duration / $1DAY_MINUTE) * 100)
}

type DateTimePayload = { date: Date; time?: Date } | { date?: Date; time: Date }
export const setDateTime = ({
  date: _date = new Date(),
  time = new Date(),
}: DateTimePayload) => {
  const year = getYear(_date),
    month = getMonth(_date),
    date = getDate(_date)
  return set(time, { year, month, date })
}
