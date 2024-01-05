'use server'

import { withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { TaskCreateInput, taskCreateInputSchema } from '@/types/schema'

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
