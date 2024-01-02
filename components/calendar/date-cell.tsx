'use client'

import useToday from '@/lib/useToday'
import { getDate, isSameDay } from 'date-fns'
import { ButtonHTMLAttributes } from 'react'

interface Props {
  active?: boolean
  value: Date
  onClick: (date: Date) => void
  isCurrentMonth: boolean
}

const defaultStyle =
  'w-[24px] h-[24px] rounded-full leading-[24px] text-xs overflow-hidden'

// TODO: today style
const DateCell = ({ value, active, onClick, isCurrentMonth }: Props) => {
  const { today } = useToday()

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`${defaultStyle} ${
        isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
      } ${
        active
          ? 'bg-blue-100 hover:bg-blue-100/50'
          : 'bg-white hover:bg-gray-100'
      }`}
    >
      {getDate(value)}
    </button>
  )
}

export default DateCell
