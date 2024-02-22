'use client'

import {
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

import { routes } from '@/constants/routes'

import NavItem, { NavItemProps } from './nav-item'

const items: NavItemProps[] = [
  // {
  //   title: 'Timer',
  //   Icon: ClockIcon,
  //   href: '/timer',
  // },
  {
    title: '시간표',
    Icon: CalendarIcon,
    href: routes.schedule.day,
  },
  {
    title: '카테고리',
    Icon: ChartBarIcon,
    href: routes.categories.root,
  },
]

const Navigation = () => (
  <nav className="flex flex-col gap-2">
    {items.map((props) => (
      <NavItem key={props.href} {...props} />
    ))}
  </nav>
)

export default Navigation
