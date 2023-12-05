'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export interface NavItemProps {
  title: string
  href: string
  Icon: HeroIcon
}

export default function NavItem({ title, href, Icon }: NavItemProps) {
  const pathname = usePathname()
  const active = useMemo(() => pathname === href, [href, pathname])
  const bg = useMemo(
    () => (active ? 'bg-teal-600/50' : 'hover:bg-neutral-200/50'),
    [active]
  )
  const iconColor = useMemo(
    () => (active ? 'text-neutral-900' : 'text-neutral-600'),
    [active]
  )

  return (
    <Link
      href={href}
      aria-label={title}
      className={`group flex items-center rounded-lg px-3 py-2 transition duration-150 gap-8 cursor-pointer ${bg}`}
    >
      <Icon aria-hidden className={`h-5 w-5 stroke-2 ${iconColor}`} />
      <span>{title}</span>
    </Link>
  )
}
