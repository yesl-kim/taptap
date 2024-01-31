import { z } from 'zod'
import { isAfter, isSameDay } from 'date-fns'

import { colorSchema } from '@/types/schema'

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

const categorySchema = z.object(
  {
    title: z.string(),
  },
  { required_error: '카테고리를 선택해주세요' },
)

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

export const newTaskFormInputSchema = newTaskFormFieldSchema.partial({
  category: true,
})

export const newTaskFormPayloadSchema = newTaskFormFieldSchema
  .partial()
  .extend({
    time: z.union([z.object({ start: z.date() }), z.object({ end: z.date() })]),
  })

export type PeriodType = z.infer<typeof periodSchema>

export type NewTaskFormField = z.input<typeof newTaskFormFieldSchema>
export type NewTaskFormInput = Partial<NewTaskFormField>
export type NewTaskFormPayload = Partial<NewTaskFormField>
export type NewTaskFormValue = z.output<typeof newTaskFormFieldSchema>
