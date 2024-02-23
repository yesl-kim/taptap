import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

import type { Metadata } from 'next'
import './globals.css'
import GlobalProvider from '@/containers/global-provider'

import Sidebar from '@/components/sidebar/sidebar'
import Profile from '@/components/profile/profile'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'taptap',
  description: '시간관리 앱, 텝텝',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalProvider>
      <html lang="ko">
        <body className={inter.className}>
          <div className="flex min-h-screen gap-1 bg-neutral-100">
            <div className="flex flex-1 flex-col">{children}</div>
            <Sidebar />
          </div>
          <Toaster />
        </body>
      </html>
    </GlobalProvider>
  )
}
