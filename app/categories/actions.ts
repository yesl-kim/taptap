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

export const createCategory = async (_: any, formData: FormData) => {
  const schema = z
    .object({
      title: z.string().min(1),
    })
    .transform(async (data, ctx) => {
      const session = await auth()
      if (!session?.user?.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '로그인이 필요한 서비스입니다.',
        })
        return z.NEVER
      }

      const prevCategory = await prisma.category.findUnique({
        where: {
          owner_title: {
            owner: session.user.email,
            title: data.title,
          },
        },
      })
      if (prevCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '카테고리가 이미 존재합니다.',
        })
        return z.NEVER
      }

      return { ...data, session }
    })

  const parse = await schema.spa({
    title: formData.get('title'),
  })

  if (!parse.success) {
    const formatted = parse.error.format()
    return { ok: false, message: formatted?._errors[0] }
  }

  const { title, session } = parse.data

  try {
    await prisma.category.create({
      data: {
        title,
        user: {
          connect: {
            email: session.user?.email as string,
          },
        },
      },
    })

    revalidatePath('/categories')
    return { ok: true, message: '카테고리가 성공적으로 생성되었습니다.' }
  } catch (e) {
    console.log('error: ', e)
    return {
      ok: false,
      message:
        '이런, 카테고리 생성에 실패하였습니다! 잠시 후 다시 시도해주세요.',
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
    return { ok: true }
  } catch (e) {
    console.log('error: ', e)
    return {
      ok: false,
      message: '이런, 카테고리 삭제에 실패하였습니다! 다시 시도해주세요.',
    }
  }
}
