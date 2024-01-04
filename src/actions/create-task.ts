'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const model = z.object({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const sessionSchema = z.object({
  user: z.object({
    email: z.string(),
    name: z.optional(z.string()),
    image: z.optional(z.string()),
  }),
})

type Session = z.infer<typeof sessionSchema>

// TODO: 해보자 user id token에 저장하기
const userSchema = model.extend({
  email: z.string(),
})

const repeatSchema = model.extend({
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

const repeatCreateInputSchema = repeatSchema.pick({
  startDate: true,
})

const categorySchema = model.extend({
  title: z.string().min(1),
})

// TODO: add records type
const taskSchema = model.extend({
  title: z.string(),
  color: z.string(),
  repeats: z.array(repeatSchema),
  categoryId: z.string().cuid(),
  category: categorySchema,
  userId: z.string().cuid(),
  user: userSchema,
})

const taskCreateInputSchema = taskSchema
  .pick({
    title: true,
    color: true,
    categoryId: true,
  })
  .extend({
    repeats: z.array(repeatCreateInputSchema),
  })

type TaskCreateInput = z.infer<typeof taskCreateInputSchema>

const withAuth = <T>(schema: z.ZodType<T>) =>
  schema.transform(async (data, ctx) => {
    const s = await auth()
    const session = sessionSchema.safeParse(await auth())
    console.log('session', s)
    console.log('parsed session', session)
    if (!session.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '로그인이 필요한 서비스입니다.',
      })
      return z.NEVER
    }

    return { ...data, session: session.data }
  })

// 1. validate
//  - if user login -> get user
//  - data type
// 2. create new task
// TODO: error handling
export const createTask = async (data: TaskCreateInput) => {
  try {
    // ??? variables name
    const schemaWithAuth = withAuth(taskCreateInputSchema)

    const {
      title,
      color,
      repeats,
      categoryId,
      session: {
        user: { email },
      },
    } = await schemaWithAuth.parseAsync(data)

    await prisma.task.create({
      data: {
        title,
        color,
        repeat: {
          createMany: {
            data: repeats,
          },
        },
        category: {
          connect: {
            id: categoryId,
          },
        },
        user: {
          connect: {
            email,
          },
        },
      },
    })
  } catch (error) {
    console.log('error in create task: ', error)
  }
}
