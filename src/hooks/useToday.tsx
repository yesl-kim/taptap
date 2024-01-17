'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  addDays,
  differenceInMilliseconds,
  sub,
  startOfDay,
  endOfDay,
  add,
} from 'date-fns'

interface TodayContextType {
  today: Date
  offset: number
  setOffset: (hour: number) => void
  getStartOfDay: (date: Date) => Date
  getEndOfDay: (date: Date) => Date
}

const DEFAULT_OFFSET = 4 // 하루의 시작은 4시. 추후 사용자 설정 가능
const TodayContext = createContext<null | TodayContextType>(null)

export const TodayContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [offset, setOffset] = useState(DEFAULT_OFFSET)
  const getStartOfDay = useCallback(
    // 하루의 시작 시간으로 맞춤
    (date: Date) =>
      add(startOfDay(sub(date, { hours: DEFAULT_OFFSET })), {
        hours: offset,
      }),
    [offset]
  )

  const getEndOfDay = useCallback(
    (date: Date) =>
      add(endOfDay(sub(date, { hours: DEFAULT_OFFSET })), {
        hours: offset,
      }),
    [offset]
  )

  const [today, setToday] = useState(getStartOfDay(new Date()))

  useEffect(() => {
    const tomorrow = getStartOfDay(addDays(today, 1))
    const delay = differenceInMilliseconds(tomorrow, new Date())
    const id = setTimeout(() => setToday(tomorrow), delay)
    return () => clearTimeout(id)
  }, [today, getStartOfDay])

  const value = useMemo(
    () => ({ today, getStartOfDay, offset, setOffset, getEndOfDay }),
    [today, offset, getStartOfDay, getEndOfDay]
  )

  return <TodayContext.Provider value={value}>{children}</TodayContext.Provider>
}

const useToday = (): TodayContextType => {
  const context = useContext(TodayContext)

  if (!context) {
    throw new Error('today context not found')
  }

  return context
}

export default useToday
