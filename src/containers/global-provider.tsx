'use client'

import { SessionProvider } from 'next-auth/react'

import { TodayContextProvider } from '@/hooks/useToday'

import NewTaskContextProvider from './new-task/new-task-context'

export default function GlobalProvider({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <TodayContextProvider>
        <NewTaskContextProvider>{children}</NewTaskContextProvider>
      </TodayContextProvider>
    </SessionProvider>
  )
}
