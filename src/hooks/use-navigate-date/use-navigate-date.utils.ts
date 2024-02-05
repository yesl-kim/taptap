import { getDate, getMonth, getYear } from 'date-fns'
import { z } from 'zod'

export const scheduleRouteSchema = z.string().regex(/^\/schedule\/(day|week)/)

export const isSchedulePage = (pathname: string) =>
  scheduleRouteSchema.safeParse(pathname)

const PARAMS_DATE = 'dateArgs' as const
export const dateParamsSchema = z
  .object({
    [PARAMS_DATE]: z
      .string()
      .regex(/[0-9]+/)
      .array()
      .length(3),
  })
  .transform((p) => p[PARAMS_DATE])

export const dateToParams = (date: Date | string | number) => {
  const y = getYear(date),
    m = getMonth(date) + 1,
    d = getDate(date)
  return `${y}/${m}/${d}`
}

export const parmasToDate = (params: any) => {
  try {
    const [y, m, d] = dateParamsSchema.parse(params)
    const monthIndex = +m - 1 ?? 0
    const date = new Date(+y, monthIndex, +d)

    return z.date().parse(date)
  } catch {
    return
  }
}
