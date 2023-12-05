'use client'

import Image from 'next/image'
import profilePlaceholder from '@/public/profile-placeholder.jpeg'
import { useSession } from 'next-auth/react'

export default function Avatar() {
  const { data: session } = useSession()
  return (
    <div className="relative overflow-hidden w-[50px] h-[50px] rounded-full">
      <Image
        alt="프로필 이미지"
        src={session?.user?.image ?? profilePlaceholder}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: 'cover' }}
        priority
        fill
      />
    </div>
  )
}
