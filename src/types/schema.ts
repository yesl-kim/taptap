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

export const repeatSchema = model.extend({
  startDate: z.date(),
  endDate: z.optional(z.date()),
  times: z.optional(z.array(z.tuple([z.string(), z.string()]))),
  type: z.optional(z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly'])),
  interval: z.optional(z.number().int().positive()),
  months: z.array(z.number().int().gte(1).lte(12)),
  daysOfMonth: z.array(z.number().int().gte(1).lte(31)),
  weekOfMonth: z.number().int().nonnegative(),
  daysOfWeek: z.array(z.number().int().gte(0).lte(6)),
})

export const repeatCreateInputSchema = repeatSchema.pick({
  startDate: true,
})

export const categorySchema = model.extend({
  title: z.string().min(1),
})

export const categoryCreateInputSchema = categorySchema.pick({
  title: true,
})

// TODO: add records type
export const taskSchema = model.extend({
  title: z.string(),
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
    categoryId: true,
  })
  .extend({
    repeats: z.array(repeatCreateInputSchema),
  })

export type TaskCreateInput = z.infer<typeof taskCreateInputSchema>
