'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Category } from '@prisma/client'

import { sessionSchema } from '@/types/schema'

// TODO: 에러를
// 1. throw
// 2. 화면에서 받아서 처리 (?)
// 에러 구분 -> 에러 바운더리로 처리
export const getCategories = async (): Promise<Category[]> => {
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
}
