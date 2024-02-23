import { Interval, differenceInMinutes } from 'date-fns'

import { HEIGHT_PER_MINUTE, HEIGHT_PER_STEP, STEP } from './timetable.constants'

export const heightFloorToStep = (y: number) =>
  Math.floor(y / HEIGHT_PER_STEP) * HEIGHT_PER_STEP

export const intervalToHeight = ({ start, end }: Interval) => {
  const duration = differenceInMinutes(end, start)
  return duration * HEIGHT_PER_MINUTE
}

export const heightToDuration = (height: number) =>
  Math.floor(height / HEIGHT_PER_MINUTE)
