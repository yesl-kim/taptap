'use client'

import { getDate } from 'date-fns'

import useToday from '@/hooks/useToday'

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
        isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
      } ${
        active
          ? 'bg-blue-100 hover:bg-blue-300/50'
          : 'bg-white hover:bg-gray-100'
      }`}
    >
      {getDate(value)}
    </button>
  )
}

export default DateCell
