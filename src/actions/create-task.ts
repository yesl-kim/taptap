'use server'

import { withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { fromZodError } from 'zod-validation-error'
import { z } from 'zod'

import { TaskCreateInput, taskCreateInputSchema } from '@/types/schema'

export const createTask = async (data: TaskCreateInput) => {
  try {
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

    const task = await prisma.task.create({
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

    return { success: true, data: task }
    // TODO: revalidate
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: fromZodError(error) }
    }

    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }
  }
}
