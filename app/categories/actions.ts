'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

const authenticate = async (id: string) => {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('[403] 인증되지 않은 사용자')
  }

  const category = await prisma.category.findUnique({
    where: { id },
    select: { user: { select: { email: true } } },
  })
  if (category?.user.email !== session.user.email) {
    throw new Error('[403] 권한없는 수정 요청')
  }
}

// TODO: zod로 타입 체킹?
export const createCategory = async (_: any, formData: FormData) => {
  const session = await auth()
  if (!session?.user?.email) {
    return { message: '로그인이 필요한 서비스입니다.' }
  }

  const schema = z.object({
    title: z.string().min(1),
  })

  const parse = schema.safeParse({
    title: formData.get('title'),
  })

  if (!parse.success) {
    return { message: '입력값을 확인해주세요.' }
  }

  const data = parse.data

  try {
    await prisma.category.create({
      data: {
        title: data.title,
        user: {
          connect: {
            email: session.user?.email,
          },
        },
      },
    })

    revalidatePath('/categories')
    return { message: '카테고리가 생성되었습니다~' }
  } catch (e) {
    console.log('error: ', e)
    return {
      message: '이런, 카테고리 생성에 실패하였습니다! 다시 시도해주세요.',
    }
  }
}

export const updateCategory = async (_: any, formData: FormData) => {
  const schema = z.object({
    id: z.string(),
    title: z.string().min(1),
  })

  const parse = schema.safeParse({
    title: formData.get('title'),
    id: formData.get('id'),
  })

  if (!parse.success) {
    return { message: '입력값을 확인해주세요.' }
  }

  const { id, title } = parse.data

  try {
    await authenticate(id)
    await prisma.category.update({
      where: { id },
      data: { title },
    })

    revalidatePath('/categories')
    return { message: '카테고리가 수정되었습니다~' }
  } catch (e) {
    console.error('error: ', e)
    return {
      message: '이런, 카테고리 수정에 실패하였습니다! 다시 시도해주세요.',
    }
  }
}

export const deleteCategory = async (id: string) => {
  try {
    await authenticate(id)
    await prisma.category.delete({ where: { id } })
    revalidatePath('/categories')
    return { message: '카테고리가 삭제되었습니다~' }
  } catch (e) {
    console.log('error: ', e)
    return {
      message: '이런, 카테고리 삭제에 실패하였습니다! 다시 시도해주세요.',
    }
  }
}
