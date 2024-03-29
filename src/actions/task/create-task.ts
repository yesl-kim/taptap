'use server'

import { withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { startOfDay } from 'date-fns'
import { revalidatePath } from 'next/cache'

import { TaskCreateInput, taskCreateInputSchema } from '@/types/schema'
import { routes } from '@/constants/routes'

export const createTask = async (
  data: TaskCreateInput,
): Promise<ApiResponse<null>> => {
  try {
    const schemaWithAuth = withAuth(taskCreateInputSchema).refine((task) => {
      const repeats = task.repeats.map((r) => ({
        ...r,
        startDate: startOfDay(r.startDate),
      }))
      return { ...task, repeats }
    })

    const {
      title,
      color,
      category,
      repeats,
      session: {
        user: { email },
      },
    } = await schemaWithAuth.parseAsync(data)

    await prisma.task.create({
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

    revalidatePath(routes.schedule.root, 'layout')
    return { success: true, data: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: '입력값을 확인해주세요.' }
    }

    return {
      success: false,
      error: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }
  }
}
