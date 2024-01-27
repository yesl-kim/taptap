import { Menu } from '@headlessui/react'
import { format } from 'date-fns'
import { forwardRef } from 'react'

import Calendar from './calendar/calendar'

type DateSelectProps = {
  value?: Date | string | number
  onChange: (date: Date) => void
  placeholder?: string
}

const DateSelect = forwardRef<HTMLButtonElement, DateSelectProps>(
  ({ value, onChange, placeholder }, ref) => (
    <Menu as="div" className="relative">
      <Menu.Button
        ref={ref}
        className="px-3 py-2 rounded transition-all outline-none focus:outline-none focus:bg-neutral-200 text-sm text-gray-600 hover:bg-neutral-100"
      >
        {value ? format(value, 'yyyy년 M월 d일') : placeholder ?? '날짜 선택'}
      </Menu.Button>
      <Menu.Items className="absolute mt-2 bg-white z-10 pb-2 shadow-md rounded">
        <Menu.Item>
          {({ close }) => (
            <Calendar
              selectedDate={value}
              onChange={(date) => {
                onChange(date)
                close()
              }}
            />
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
)

DateSelect.displayName = 'DateSelect'

export default DateSelect
