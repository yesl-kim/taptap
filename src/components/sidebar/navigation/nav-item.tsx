'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import clsx from 'clsx'

import Tooltip from '@/components/tooltip'

export interface NavItemProps {
  title: string
  href: string
  Icon: HeroIcon
}

const NavItem = ({ title, href, Icon }: NavItemProps) => {
  const pathname = usePathname()
  const active = useMemo(() => pathname.startsWith(href), [href, pathname])

  return (
    <Tooltip
      label={title}
      trigger={
        <Link
          href={href}
          aria-label={title}
          className={clsx(
            'group flex cursor-pointer items-center gap-8 rounded-full p-2 transition duration-150',
            active ? 'bg-teal-600/50' : 'hover:bg-neutral-200/50',
          )}
        >
          <Icon
            aria-hidden
            className={clsx(
              'h-5 w-5 stroke-2',
              active ? 'stroke-neutral-900' : 'stroke-neutral-500',
            )}
          />
        </Link>
      }
    />
  )
}

export default NavItem
