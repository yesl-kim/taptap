'use server'

import { withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ValidationError, fromZodError } from 'zod-validation-error'
import { z } from 'zod'

import {
  TaskCreateInput,
  taskCreateInputSchema,
  taskSchema,
} from '@/types/schema'
import { responseSchema } from '@/types/api'

const response = responseSchema(z.NEVER)
type CreateTaskResponse = z.infer<typeof response>

export const createTask = async (
  data: TaskCreateInput
): Promise<CreateTaskResponse> => {
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
        repeats: {
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

    return { success: true }
    // TODO: revalidate
  } catch (error) {
    console.log('error: ', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: '입력값을 확인해주세요.' }
    }

    return {
      success: false,
      error: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }
  }
}
