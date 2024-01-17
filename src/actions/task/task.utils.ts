import {
  isSameDay,
  isBefore,
  isAfter,
  getDay,
  getWeek,
  getDate,
  getMonth,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  format,
  startOfDay,
  endOfDay,
} from 'date-fns'
import { Repeat, RepeatType } from '@prisma/client'

import { isEmpty } from '@/utils/validator'

type DifferenceMap = {
  [key in RepeatType]: (
    dateLeft: Date | number,
    dateRight: Date | number
  ) => number
}

const differenceIn: DifferenceMap = {
  Daily: differenceInDays,
  Weekly: differenceInWeeks,
  Monthly: differenceInMonths,
  Yearly: differenceInYears,
}

export const isPlannedOn = (date: Date, repeat: Repeat): boolean => {
  const {
    startDate,
    endDate,
    type,
    interval,
    months,
    daysOfMonth,
    weekOfMonth,
    daysOfWeek,
  } = repeat

  if (!type || !interval) {
    return isSameDay(startDate, date)
  }

  const _date = startOfDay(date),
    _startDate = startOfDay(startDate)
  if (
    isBefore(_date, _startDate) ||
    (endDate && isAfter(date, endOfDay(endDate)))
  ) {
    return false
  }

  if (differenceIn[type](date, startDate) % interval !== 0) {
    return false
  }

  if (!isEmpty(daysOfWeek) && !daysOfWeek.includes(getDay(date))) {
    return false
  }

  if (weekOfMonth && weekOfMonth !== getWeek(date)) {
    return false
  }

  if (!isEmpty(daysOfMonth) && !daysOfMonth.includes(getDate(date))) {
    return false
  }

  if (!isEmpty(months) && !months.includes(getMonth(date))) {
    return false
  }

  return true
}
