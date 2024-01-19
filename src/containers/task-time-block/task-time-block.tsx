'use client'

import { Popover } from '@headlessui/react'
import { Interval, format } from 'date-fns'
import {
  ListBulletIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { ko } from 'date-fns/locale'

import { Period } from '@/types/schema'

import PopoverPanelLayout from '@/components/popover-panel-layout'
import ListItem from '@/components/list-item'
import { intervalToString } from './task-time-block.utils'

type TaskTimeBlockProps = {
  task: {
    title: string
    color: string
    category: {
      title: string
    }
    time?: Period
  }
  date: Date
}

const TaskTimeBlock = ({ task, date }: TaskTimeBlockProps) => {
  const {
    title,
    color,
    category: { title: category },
    time,
  } = task
  const buttons = [
    { Icon: PencilIcon, label: '할 일 수정' },
    { Icon: TrashIcon, label: '할 일 삭제' },
  ]

  return (
    <Popover className="relative">
      <Popover.Button
        className="flex w-full rounded pt-0.5 pr-2 overflow-hidden text-white whitespace-nowrap break-words text-ellipsis opacity-50"
        style={{ backgroundColor: color }}
      >
        <span>{title}</span>,&nbsp;
        {time && <span>{intervalToString(time)}</span>}
      </Popover.Button>

      <Popover.Panel className="absolute z-10 w-screen max-w-[500px]">
        {({ close }) => (
          <PopoverPanelLayout header={buttons} close={close}>
            <ul className="pl-5">
              <ListItem
                before={
                  <i
                    className="block w-[17px] h-[17px] rounded"
                    style={{ backgroundColor: color }}
                  />
                }
              >
                <p className="text-gray-700 text-xl mb-1">{title}</p>
                <p className="flex gap-2 text-gray-500 text-xs">
                  <span>{format(date, 'm월 d일 (EEEE)', { locale: ko })}</span>
                  <span>&#183;</span>
                  {time && <span>{intervalToString(time)}</span>}
                </p>
              </ListItem>
              <ListItem
                before={
                  <ListBulletIcon strokeWidth={2} className="text-gray-500" />
                }
              >
                <p className="text-gray-600">{category}</p>
              </ListItem>
            </ul>
          </PopoverPanelLayout>
        )}
      </Popover.Panel>
    </Popover>
  )
}

export default TaskTimeBlock
