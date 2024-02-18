import { z } from 'zod'
import { isAfter, isSameDay } from 'date-fns'
import _ from 'lodash'

import { colorSchema, taskCreateInputSchema } from '@/types/schema'
import { dateToTimestringForDB } from '@/utils/datetime'

const periodSchema = z
  .object({
    start: z.date(),
    end: z.date(),
  })
  .superRefine(({ start, end }, ctx) => {
    if (isAfter(end, start)) return
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '시작 시간은 종료 시간 이전이어야 합니다.',
      path: ['end'],
    })
  })

const categorySchema = z
  .object({
    title: z.string().min(1),
  })
  .refine((c) => !!_.get(c, 'title'), { message: '카테고리를 선택해주세요.' })

export const newTaskFormFieldSchema = z.object({
  title: z
    .string({ required_error: '제목을 입력해주세요.' })
    .min(1, { message: '제목을 입력해주세요.' }),
  category: categorySchema,
  color: colorSchema,
  startDate: z
    .date({ required_error: '날짜를 선택해주세요.' })
    .refine(
      (date) => isSameDay(date, new Date()) || isAfter(date, new Date()),
      {
        message: '과거의 날짜는 추가할 수 없습니다.',
      },
    ),
  time: periodSchema.nullable().optional(),
})

export const newTaskFormInputSchema = newTaskFormFieldSchema.partial()

export const newTaskFormOuputSchema = newTaskFormFieldSchema.transform(
  ({ startDate, time, ...task }) => {
    if (!time) {
      return { ...task, repeats: [{ startDate }] }
    }
    const parsedTime = _.mapValues(time, (t) => dateToTimestringForDB(t))
    return { ...task, repeats: [{ startDate, times: [parsedTime] }] }
  },
)

export type PeriodType = z.infer<typeof periodSchema>

export type NewTaskFormPayload = z.infer<typeof newTaskFormInputSchema>
export type NewTaskFormField = z.input<typeof newTaskFormFieldSchema>
export type NewTaskFormOutput = z.output<typeof newTaskFormOuputSchema>
