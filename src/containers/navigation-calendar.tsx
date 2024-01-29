'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { getDate, getMonth, getYear } from 'date-fns'
import { z } from 'zod'
import { useEffect, useMemo } from 'react'

import Calendar from '@/components/calendar/calendar'

const PARAMS_DATE = 'dateArgs' as const
const paramsSchema = z
  .object({
    [PARAMS_DATE]: z
      .string()
      .regex(/[0-9]+/)
      .array()
      .length(3),
  })
  .transform((p) => p[PARAMS_DATE])

const dateToParams = (date: Date | string | number) => {
  const y = getYear(date),
    m = getMonth(date) + 1,
    d = getDate(date)
  return `${y}/${m}/${d}`
}

const parmasToDate = (params: any) => {
  const [y, m, d] = paramsSchema.parse(params)
  const monthIndex = +m - 1 ?? 0
  const date = new Date(+y, monthIndex, +d)

  return z.date().parse(date)
}

const NavigationCalendar = () => {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()

  const selectedDate = useMemo(() => parmasToDate(params), [params])

  const navigate = (date: Date | string | number) => {
    const parmasString = paramsSchema.parse(params).join('/')
    router.push(pathname.replace(parmasString, dateToParams(date)))
  }

  useEffect(() => {
    console.log('sd', selectedDate)
  }, [selectedDate])

  return <Calendar selectedDate={selectedDate} onChange={navigate} />
}

export default NavigationCalendar
