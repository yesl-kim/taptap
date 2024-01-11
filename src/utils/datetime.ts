import { roundToNearestMinutes } from 'date-fns'

const STEP = 30
export const round30Minutes = (time: Date) =>
  roundToNearestMinutes(time, {
    nearestTo: STEP,
    roundingMethod: 'ceil',
  })
