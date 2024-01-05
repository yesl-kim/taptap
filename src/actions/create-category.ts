'use server'

import { withAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import { categoryCreateInputSchema } from '@/types/schema'

export const createCategory = async (_: any, formData: FormData) => {
  const validatedSchema = withAuth(categoryCreateInputSchema).transform(
    async (data, ctx) => {
      const prevCategory = await prisma.category.findUnique({
        where: {
          owner_title: {
            owner: data.session.user.email,
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

      return data
    }
  )

  try {
    const { title, session } = await validatedSchema.parseAsync({
      title: formData.get('title'),
    })

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
