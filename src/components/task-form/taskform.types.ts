import { z } from 'zod'
import _ from 'lodash'
import { isAfter } from 'date-fns'

import { dateToTimestringForDB } from '@/utils/datetime'

const dateSchema = z.union([z.date(), z.string().datetime()])

const periodSchema = z
  .object({
    start: dateSchema,
    end: dateSchema,
  })
  .superRefine(({ start, end }, ctx) => {
    if (isAfter(end, start)) return
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '시작 시간은 종료 시간 이전이어야 합니다.',
      path: ['end'],
    })
  })

const timesSchema = z.array(periodSchema).superRefine((times, ctx) => {
  if (times.length <= 1) return

  for (let i = 1; i < times.length; i++) {
    const prev = times[i - 1]
    const cur = times[i]
    if (isAfter(cur.start, prev.end)) continue

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: [i, 'start'],
      message: '기간은 겹칠 수 없습니다.',
    })
    return z.NEVER
  }
})

const repeatSchema = z.object({
  startDate: dateSchema,
  endDate: z.optional(dateSchema),
  times: z.optional(timesSchema),
  interval: z.optional(z.number().int().positive()),
  type: z.optional(z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly'])),
  daysOfWeek: z.array(z.number().int().gte(0).lte(6)),
})

type Repeat = z.infer<typeof repeatSchema>

const categorySchema = z.object({
  title: z.string({ required_error: '카테고리를 선택해주세요.' }),
})

const colorSchema = z
  .string({ required_error: '색상을 선택해주세요.' })
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: '올바른 색상 코드를 입력해주세요.',
  })

export const taskFormSchema = z
  .object({
    title: z.string().min(1, { message: '제목을 입력해주세요.' }),
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
