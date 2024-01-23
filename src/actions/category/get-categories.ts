import 'server-only'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { cache } from 'react'

import { sessionSchema } from '@/types/schema'

export const preloadCategories = () => {
  void getCategories()
}

// TODO: 에러를
// 1. throw
// 2. 화면에서 받아서 처리 (?)
// 에러 구분 -> 에러 바운더리로 처리
export const getCategories = cache(async () => {
  //   try {
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
  //   } catch (error) {}
})
