import { RoundingMethod, roundToNearestMinutes } from 'date-fns'

const STEP = 30
export const round30Minutes = (
  time: Date,
  roundingMethod = 'ceil' as RoundingMethod
) =>
  roundToNearestMinutes(time, {
    nearestTo: STEP,
    roundingMethod,
  })
