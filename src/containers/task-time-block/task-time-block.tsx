'use client'

import { Popover } from '@headlessui/react'
import { format } from 'date-fns'
import {
  ListBulletIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { ko } from 'date-fns/locale'

import PopoverPanelLayout from '@/components/popover-panel-layout'
import ListItem from '@/components/list-item'
import { intervalToString } from './task-time-block.utils'

type TaskTimeBlockProps = {
  task: {
    title: string
    color: string
    category: string
    startTime: Date
    endTime: Date
  }
  date: Date
}

const TaskTimeBlock = ({ task, date }: TaskTimeBlockProps) => {
  const { title, color, category, startTime, endTime } = task
  const buttons = [
    { Icon: PencilIcon, label: '할 일 수정' },
    { Icon: TrashIcon, label: '할 일 삭제' },
  ]

  return (
    <Popover className="relative">
      <Popover.Button
        className="flex w-full rounded pt-0.5 pr-2 overflow-hidden text-white whitespace-nowrap break-words text-ellipsis"
        style={{ backgroundColor: color }}
      >
        <span>{title}</span>,&nbsp;
        <span>{intervalToString(startTime, endTime)}</span>
      </Popover.Button>

      <Popover.Panel className="absolute z-10 w-screen max-w-[500px]">
        <PopoverPanelLayout header={buttons}>
          <ul className="pl-7">
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
                <span>{intervalToString(startTime, endTime)}</span>
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
      </Popover.Panel>
    </Popover>
  )
}

export default TaskTimeBlock
