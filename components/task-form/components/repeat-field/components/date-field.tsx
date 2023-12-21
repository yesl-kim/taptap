'use client'

import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import TimeField from './time-field'

export default function DateField() {
  const [allday, setAllday] = useState(false)
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input type="date" name="startDate" />
        {!allday && (
          <TimeField
            start={new Date('2023-12-21 9:00')}
            end={new Date('2023-12-21 23:31')}
          />
        )}
      </div>
      <Switch
        checked={allday}
        onChange={setAllday}
        className="flex gap-2 items-center cursor-pointer"
      >
        <div
          role="checkbox"
          aria-checked={allday}
          className="w-[18px] h-[18px] border-2 border-neutral-700 rounded-sm ui-checked:bg-blue-500 ui-checked:border-blue-500 transition-all"
        >
          <CheckIcon
            aria-hidden
            strokeWidth={3}
            className="text-white ui-not-checked:hidden"
          />
        </div>
        <span>종일</span>
      </Switch>
    </div>
  )
}
