import 'server-only'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { cache } from 'react'

import { sessionSchema } from '@/types/schema'

export const getCategories = cache(async () => {
  const {
    user: { email },
  } = sessionSchema.parse(await auth())

  const categories = await prisma.category.findMany({
    where: {
      owner: email,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return categories
})
