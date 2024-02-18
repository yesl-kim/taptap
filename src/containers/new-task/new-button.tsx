'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { memo, useCallback } from 'react'

import useNavigateDate from '@/hooks/use-navigate-date/use-navigate-date'
import { round30Minutes, setDateTime } from '@/utils/datetime'

import { useNewTaskContext } from './new-task-context'

/*
[ ] 1. 할 일 / 시간 기록 선택
[ ] 2. 선택한 거 생성
*/
const NewButton = () => {
  const { create } = useNewTaskContext()
  const { selectedDate } = useNavigateDate()

  const createTask = useCallback(() => {
    create(
      setDateTime({ date: selectedDate, time: round30Minutes(new Date()) }),
    )
  }, [selectedDate, create])

  return (
    <div>
      <button
        type="button"
        onClick={createTask}
        className={`relative flex h-[55px] w-full max-w-[180px] items-center justify-between rounded-full border-[1px] border-gray-100 bg-white bg-no-repeat px-3 text-center text-neutral-600 shadow-base transition-all hover:shadow-lg hover:shadow-neutral-500/50 hover:brightness-100`}
      >
        <div
          aria-hidden
          className={`h-full w-[25%] max-w-[40px] bg-gradient-to-br from-yellow-400 from-10% via-green-500 to-red-700 [mask-image:var(--background-image-plus)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:100%_100%]`}
        />
        <span>만들기</span>
        <ChevronDownIcon className="w-5 pr-1 text-gray-400" strokeWidth={3} />
      </button>
    </div>
  )
}

export default memo(NewButton)
