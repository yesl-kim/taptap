import { RoundingMethod, format, parse, roundToNearestMinutes } from 'date-fns'

import { timestringSchema } from '@/types/schema'

const STEP = 30
export const round30Minutes = (
  time: Date,
  roundingMethod = 'ceil' as RoundingMethod
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
