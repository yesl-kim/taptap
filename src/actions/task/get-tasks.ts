import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Repeat, Task } from '@prisma/client'
import { startOfDay } from 'date-fns'

import { sessionSchema } from '@/types/schema'

import { isPlannedOn } from './task-action.utils'

type SuccessResponse<T> = { success: true; data: T }
type ErrorResponse = { success: false; error: string }
type ResponseType<T> = SuccessResponse<T> | ErrorResponse
export type TaskWithRepeat = Task & { repeat: Repeat }

export const getTasksByDate = async (
  _date: Date
): Promise<ResponseType<TaskWithRepeat[]>> => {
  const date = startOfDay(_date)

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
        orderBy: { createdAt: 'asc' },
      })
    )
      .map(({ repeats, ...task }) => ({
        ...task,
        repeat: repeats.find(isPlanned),
      }))
      .filter((task): task is TaskWithRepeat => !!task.repeat)

    return { success: true, data: tasks }
  } catch (e) {
    return {
      success: false,
      error: 'error',
    }
  }
}
