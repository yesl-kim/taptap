import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'
import Google from 'next-auth/providers/google'
import { z } from 'zod'

import type { NextAuthConfig } from 'next-auth'
import { sessionSchema } from '@/types/schema'

export const config = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized({ auth }) {
      return !!auth
    },
    // async session({ session, token }) {
    //   session.user.id = token.id
    //   return session
    // },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

export const withAuth = <T>(schema: z.ZodType<T>) =>
  schema.transform(async (data, ctx) => {
    const session = sessionSchema.safeParse(await auth())
    if (!session.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '로그인이 필요한 서비스입니다.',
      })
      return z.NEVER
    }

    return { ...data, session: session.data }
  })
