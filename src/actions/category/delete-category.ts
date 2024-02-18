'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { sessionSchema } from '@/types/schema'
import { routes } from '@/constants/routes'

export const deleteCategory = async (id: string) => {
  try {
    const {
      user: { email },
    } = await sessionSchema.parse(await auth())

    const category = await prisma.category.findUnique({
      where: { id },
      select: { user: { select: { email: true } } },
    })

    if (category?.user.email !== email) {
      throw new Error('[403] 권한없는 수정 요청')
    }

    await prisma.category.delete({ where: { id } })
    revalidatePath(routes.categories.root)
    return { ok: true }
  } catch (e) {
    console.log('error: ', e)
    return {
      ok: false,
      message: '이런, 카테고리 삭제에 실패하였습니다! 다시 시도해주세요.',
    }
  }
}
