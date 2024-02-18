'use server'

import { withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { categoryUpdateInputSchema } from '@/types/schema'
import { routes } from '@/constants/routes'

export const updateCategory = async (_: any, formData: FormData) => {
  try {
    const parsed = await withAuth(categoryUpdateInputSchema).spa({
      title: formData.get('title'),
      id: formData.get('id'),
    })

    console.dir(parsed)
    if (!parsed.success) {
      return { message: '입력값을 확인해주세요.' }
    }

    const { id, title } = parsed.data

    await prisma.category.update({
      where: { id },
      data: { title },
    })

    revalidatePath(routes.categories.root)
    return { message: '카테고리가 수정되었습니다~' }
  } catch (e) {
    console.error('error: ', e)
    return {
      message: '이런, 카테고리 수정에 실패하였습니다! 다시 시도해주세요.',
    }
  }
}
