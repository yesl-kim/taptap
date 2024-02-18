import { Menu } from '@headlessui/react'
import { format } from 'date-fns'
import { forwardRef } from 'react'

import Calendar from './calendar/calendar'
import FieldError from './field-error'

type DateSelectProps = {
  value?: Date | string | number
  onChange: (date: Date) => void
  placeholder?: string
  error?: string
}

const DateSelect = forwardRef<HTMLButtonElement, DateSelectProps>(
  ({ value, onChange, placeholder, error }, ref) => (
    <div>
      <Menu as="div" className="relative">
        <Menu.Button
          ref={ref}
          className="rounded px-3 py-2 text-sm text-gray-600 outline-none transition-all hover:bg-neutral-100 focus:bg-neutral-200 focus:outline-none"
        >
          {value ? format(value, 'yyyy년 M월 d일') : placeholder ?? '날짜 선택'}
        </Menu.Button>
        <Menu.Items className="absolute z-10 mt-2 rounded bg-white pb-2 shadow-md">
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

      <FieldError message={error} />
    </div>
  ),
)

DateSelect.displayName = 'DateSelect'

export default DateSelect
