'use server'

import { withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { TaskCreateInput, taskCreateInputSchema } from '@/types/schema'

// 1. validate
//  - if user login -> get user
//  - data type
// 2. create new task
// TODO: error handling
// TODO: finally? return data? action?
export const createTask = async (data: TaskCreateInput) => {
  // ??? variables name
  const schemaWithAuth = withAuth(taskCreateInputSchema)

  const {
    title,
    color,
    repeats,
    category,
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
        connectOrCreate: {
          where: {
            owner_title: {
              owner: email,
              title: category.title,
            },
          },
          create: {
            title: category.title,
            user: {
              connect: {
                email,
              },
            },
          },
        },
      },
      user: {
        connect: {
          email,
        },
      },
    },
  })
}
