'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

const schema = z.object({
  title: z.string().min(1),
})

// TODO: zod로 타입 체킹?
export const createCategory = async (prevState: any, formData: FormData) => {
  const session = await auth()
  if (!session?.user?.email) {
    return { message: '로그인이 필요한 서비스입니다.' }
  }

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
  } catch (e) {
    console.log('error: ', e)
    return {
      message: '이런, 카테고리 생성에 실패하였습니다! 다시 시도해주세요.',
    }
  }
}
