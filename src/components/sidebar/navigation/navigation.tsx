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
    title: 'Time Table',
    Icon: CalendarIcon,
    href: routes.schedule.day,
  },
  {
    title: 'Category',
    Icon: ChartBarIcon,
    href: routes.categories.root,
  },
]

export default function Navigation() {
  return (
    <nav>
      {items.map((props) => (
        <NavItem key={props.href} {...props} />
      ))}
    </nav>
  )
}
