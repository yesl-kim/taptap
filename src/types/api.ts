// request or response ======================

import { z } from 'zod'

export const responseSchema = <T>(schema: z.ZodType<T>) =>
  z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: schema,
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ])
