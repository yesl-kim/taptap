import 'server-only'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Prisma, Repeat, Task } from '@prisma/client'
import { fromUnixTime, startOfDay } from 'date-fns'
import { cache } from 'react'

import { sessionSchema } from '@/types/schema'

import { isPlannedOn } from './task-action.utils'

export type TaskWithRepeat = Prisma.TaskGetPayload<{
  include: { category: { select: { id: true; title: true } } }
}> & { repeat: Repeat }

export const preloadTasksByDate = (unixTime: number) => {
  void getTasksByDate(unixTime)
}

export const getTasksByDate = cache(
  async (unixTime: number): Promise<ApiResponse<TaskWithRepeat[]>> => {
    const date = startOfDay(fromUnixTime(unixTime))

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
          include: {
            repeats: true,
            category: { select: { id: true, title: true } },
          },
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
  },
)
