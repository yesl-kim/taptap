'use client'

import {
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import NavItem, { NavItemProps } from './nav-item'

const items: NavItemProps[] = [
  {
    title: 'Timer',
    Icon: ClockIcon,
    href: 'home',
  },
  {
    title: 'Time Table',
    Icon: CalendarIcon,
    href: 'timeTable',
  },
  {
    title: 'Dashboard',
    Icon: ChartBarIcon,
    href: 'categories',
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
