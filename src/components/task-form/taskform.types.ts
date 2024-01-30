import { z } from 'zod'
import _ from 'lodash'
import { isAfter, isSameDay, startOfDay } from 'date-fns'

import { dateToTimestringForDB } from '@/utils/datetime'
import { colorSchema } from '@/types/schema'

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

export type PeriodType = z.infer<typeof periodSchema>

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
  times: z.optional(timesSchema),
})

const nonRepeatFieldSchema = repeatSchema
  .extend({
    startDate: dateSchema.refine(
      (date) => isSameDay(date, new Date()) || isAfter(date, new Date()),
      {
        message: '과거의 날짜는 추가할 수 없습니다.',
      },
    ),
  })
  .array()
  .nonempty({ message: '날짜를 선택해주세요.' })
  .superRefine((repeats, ctx) => {
    const indices = {} as { [key: string]: number[] }
    repeats.forEach(({ startDate }, i) => {
      const key = startOfDay(startDate).toString()
      indices[key] = _.get(indices, key, [] as number[]).concat(i)
    })

    for (const idxs of Object.values(indices)) {
      if (idxs.length < 2) continue
      for (const i of idxs) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '같은 날짜가 2번 이상 추가되었습니다.',
          path: [i, 'startDate'],
        })
      }
    }
  })

const weeklyRepeatSchema = repeatSchema.extend({
  interval: z.number().int().positive(),
  daysOfWeek: z.array(z.number().int().gte(0).lte(6)).optional(),
})

const weeklyRepeatFieldSchema = weeklyRepeatSchema.optional().array().nonempty()

const repeatPayloadSchema = z
  .object({
    non: nonRepeatFieldSchema,
    weekly: weeklyRepeatFieldSchema,
  })
  .partial()

export const repeatTypeValues = z.enum(['None', 'Weekly'])
export type RepeatTypeValues = z.infer<typeof repeatTypeValues>

const repeatFieldSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(repeatTypeValues.enum.None),
    data: repeatPayloadSchema.required({
      non: true,
    }),
  }),
  z.object({
    type: z.literal(repeatTypeValues.enum.Weekly),
    startDate: dateSchema,
    endDate: dateSchema.optional(),
    data: repeatPayloadSchema.required({
      weekly: true,
    }),
  }),
])

type WeeklyRepeat = z.infer<typeof weeklyRepeatSchema>

const categorySchema = z.object({
  title: z.string({ required_error: '카테고리를 선택해주세요.' }),
})

const isExist = (repeat?: WeeklyRepeat): repeat is WeeklyRepeat =>
  Boolean(repeat)

export const taskFormSchema = z
  .object({
    title: z.string().min(1, { message: '제목을 입력해주세요.' }),
    color: colorSchema,
    category: categorySchema,
    repeat: repeatFieldSchema,
  })
  .transform(({ repeat, ...task }) => {
    const { type, data } = repeat
    const repeats =
      type === repeatTypeValues.enum.None
        ? data.non
        : data.weekly
            .filter(isExist)
            .map((option) => ({ ...repeat, ...option }))

    return { ...task, repeats }
  })
  .transform(({ repeats, ...task }) => ({
    ...task,
    repeats: repeats.map(({ times, ...r }) => ({
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
