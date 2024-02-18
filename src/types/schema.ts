import { z } from 'zod'

export const model = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const sessionSchema = z.object({
  user: z.object({
    email: z.string(),
    name: z.optional(z.string()),
    image: z.optional(z.string()),
  }),
})

export type Session = z.infer<typeof sessionSchema>

export const userSchema = model.extend({
  email: z.string(),
})

// scalar =======================================
export const colorSchema = z
  .string({ required_error: '색상을 선택해주세요.' })
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: '올바른 색상 코드를 입력해주세요.',
  })

// repeat =========================================
export const timestringSchema = z
  .string()
  .regex(/^([01][0-9])|(2[0-4]):([0-5][0-9])$/) // HH:mm
// export const dateSchema = z.date()
export const dateSchema = z.union([z.date(), z.string().datetime()])

export const periodStringSchema = z.object({
  start: timestringSchema,
  end: timestringSchema,
})

export type PeriodString = z.infer<typeof periodStringSchema>

export const periodDateSchema = z.object({
  start: dateSchema,
  end: dateSchema,
})

export type Period = z.infer<typeof periodDateSchema>

export const repeatSchema = model.extend({
  startDate: dateSchema,
  endDate: z.optional(dateSchema),
  times: z.optional(z.array(periodStringSchema)),
  type: z.optional(z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly'])),
  interval: z.optional(z.number().int().positive()),
  months: z.array(z.number().int().gte(1).lte(12)),
  daysOfMonth: z.array(z.number().int().gte(1).lte(31)),
  weekOfMonth: z.optional(z.number().int().nonnegative()),
  daysOfWeek: z.array(z.number().int().gte(0).lte(6)),
})

export const repeatCreateInputSchema = repeatSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial({
    months: true,
    daysOfMonth: true,
    daysOfWeek: true,
  })

export type Repeat = z.infer<typeof repeatSchema>

// category =========================================
export const categorySchema = model.extend({
  title: z.string({ required_error: '필수값입니다.' }).min(1),
})

export const categoryCreateInputSchema = categorySchema.pick({
  title: true,
})

export const categoryUpdateInputSchema = categorySchema.pick({
  title: true,
  id: true,
})

// task =========================================
// TODO: add records type
export const taskSchema = model.extend({
  title: z.string({ required_error: '필수값입니다.' }),
  color: z.string(),
  repeats: z.array(repeatSchema),
  categoryId: z.string().cuid(),
  category: categorySchema,
  userId: z.string().cuid(),
  user: userSchema,
})

export const taskCreateInputSchema = taskSchema
  .pick({
    title: true,
    color: true,
  })
  .extend({
    repeats: z.array(repeatCreateInputSchema),
    category: categoryCreateInputSchema,
  })

export type Task = z.infer<typeof taskSchema>

export type TaskCreateInput = z.infer<typeof taskCreateInputSchema>
