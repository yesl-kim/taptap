import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Prisma, Repeat } from '@prisma/client'

import { sessionSchema } from '@/types/schema'

import { isPlannedOn } from './task.utils'

type SuccessResponse<T> = { success: true; data: T }
type ErrorResponse = { success: false; error: string }
type ResponseType<T> = SuccessResponse<T> | ErrorResponse
type Task = Prisma.TaskGetPayload<{ include: { repeats: true } }>

export const getTasks = async (date: Date): Promise<ResponseType<Task[]>> => {
  try {
    const {
      user: { email },
    } = sessionSchema.parse(await auth())

    const isPlanned = (repeat: Repeat) => isPlannedOn(date, repeat)
    const tasks = (
      await prisma.task.findMany({
        where: {
          user: {
            email,
          },
        },
        include: { repeats: true },
      })
    ).filter(({ repeats }) => repeats.some(isPlanned))

    return { success: true, data: tasks }
  } catch (e) {
    return {
      success: false,
      error: 'error',
    }
  }
}
