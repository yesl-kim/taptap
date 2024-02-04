'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { add, format, sub } from 'date-fns'
import { memo, useCallback, useMemo } from 'react'
import { ko } from 'date-fns/locale'

import useToday from '@/hooks/useToday'
import useNavigateDate from '@/hooks/use-navigate-date/use-navigate-date'

import IconButton from '@/components/icon-button'
import Tooltip from '@/components/tooltip'

type NavigatorType = 'daily' | 'weekly'
type Direction = 'prev' | 'next'

type Props = {
  type: NavigatorType
}

type DataSet = {
  [key in NavigatorType]: {
    [key in Direction]: {
      Icon: HeroIcon
      label: string
      to: Date
    }
  }
}

const CalendarNavigator = ({ type }: Props) => {
  const { today } = useToday()
  const { navigate, selectedDate } = useNavigateDate()

  const navigateToday = useCallback(() => navigate(today), [navigate, today])
  const onNavigate = useCallback((to: Date) => () => navigate(to), [navigate])

  const dataSet: DataSet = useMemo(
    () => ({
      daily: {
        prev: {
          Icon: ChevronLeftIcon,
          label: '전 날',
          to: sub(selectedDate, { days: 1 }),
        },
        next: {
          Icon: ChevronRightIcon,
          label: '다음 날',
          to: add(selectedDate, { days: 1 }),
        },
      },
      weekly: {
        prev: {
          Icon: ChevronLeftIcon,
          label: '전 주',
          to: sub(selectedDate, { weeks: 1 }),
        },
        next: {
          Icon: ChevronRightIcon,
          label: '다음 주',
          to: add(selectedDate, { weeks: 1 }),
        },
      },
    }),
    [selectedDate],
  )

  return (
    <div className="flex items-center gap-4">
      <Tooltip
        label={format(today, 'M월 dd일 (eeee)', { locale: ko })}
        trigger={
          <button
            type="button"
            onClick={navigateToday}
            className="rounded border-[1px] border-gray-200 bg-white px-5 py-2 text-sm text-gray-600 hover:brightness-95 focus:brightness-75"
          >
            오늘
            <span className="invisible absolute">로 이동</span>
          </button>
        }
      />

      {Object.values(dataSet[type]).map(({ Icon, label, to }) => (
        <IconButton key={label} {...{ Icon, label, onClick: onNavigate(to) }} />
      ))}
    </div>
  )
}

export default memo(CalendarNavigator)
