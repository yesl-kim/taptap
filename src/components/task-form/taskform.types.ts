import { z } from 'zod'
import _ from 'lodash'

import { dateToTimestringForDB } from '@/utils/datetime'

const categorySchema = z.object({
  title: z.string(),
})

const dateSchema = z.union([z.date(), z.string().datetime()])
const periodSchema = z.object({
  start: dateSchema,
  end: dateSchema,
})
const transformedPeriodSchema = periodSchema.transform(({ start, end }) => ({
  start: dateToTimestringForDB(new Date(start)),
  end: dateToTimestringForDB(new Date(end)),
}))

const repeatSchema = z.object({
  startDate: dateSchema,
  endDate: z.optional(dateSchema),
  times: z.optional(z.array(periodSchema)),
  interval: z.optional(z.number().int().positive()),
  type: z.optional(z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly'])),
  daysOfWeek: z.array(z.number().int().gte(0).lte(6)),
})

type Repeat = z.infer<typeof repeatSchema>

const colorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)

export const taskFormSchema = z
  .object({
    title: z.string().min(1),
    color: colorSchema,
    category: categorySchema,
    repeats: z.array(z.optional(repeatSchema)),
  })
  .transform(({ repeats, ...task }) => ({
    ...task,
    repeats: repeats
      .filter((r): r is Repeat => Boolean(r))
      .map(({ times, ...r }) => ({
        ...r,
        times:
          times &&
          times.map(({ start, end }) => ({
            start: dateToTimestringForDB(new Date(start)),
            end: dateToTimestringForDB(new Date(end)),
          })),
      })),
  }))

export type TaskFormField = z.input<typeof taskFormSchema>
export type TransformedTaskFrom = z.output<typeof taskFormSchema>
