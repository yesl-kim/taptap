'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { addHours, startOfDay, subHours } from 'date-fns'
import { useRouter } from 'next/navigation'
import _ from 'lodash'

import useToday from '@/hooks/useToday'
import { defaultColorOptions } from '@/constants/task.constants'
import { round30Minutes, setDateTime } from '@/utils/datetime'
import useNavigateDate from '@/hooks/use-navigate-date/use-navigate-date'

import { NewTaskFormField, NewTaskFormPayload } from './new-task-form.types'

type NewTaskContextType = {
  task: NewTaskFormField | null
  create: (datetime?: Date) => void
  update: (task: NewTaskFormPayload) => void
  reset: () => void
}

const NewTaskContext = createContext<null | NewTaskContextType>(null)

/*
[ ] jotai
*/

const NewTaskContextProvider = ({ children }: PropsWithChildren) => {
  const { today } = useToday()
  const { navigate } = useNavigateDate()
  const [task, setTask] = useState<null | NewTaskFormField>(null)

  const defaultTask: NewTaskFormField = useMemo(() => {
    const startTime = round30Minutes(new Date())
    const endTime = addHours(startTime, 1)
    return {
      title: '',
      category: {
        title: '',
      },
      color: defaultColorOptions[0],
      startDate: today,
      time: { start: startTime, end: endTime },
    }
  }, [today])

  const create = useCallback(
    (datetime?: Date) => {
      if (!datetime) {
        setTask(defaultTask)
        return
      }

      const startDate = startOfDay(subHours(datetime, 4))
      const time = { start: datetime, end: addHours(datetime, 1) }
      setTask({
        ...defaultTask,
        startDate,
        time,
      })
    },
    [defaultTask],
  )

  const onChange = useCallback(
    (payload: NewTaskFormPayload) => {
      setTask((prev) => {
        if (!prev) return { ...defaultTask, ...payload }
        return { ...prev, ...payload }
      })
    },
    [defaultTask],
  )

  const onChangeDate = useCallback(
    (date: Date) => {
      navigate(date)

      const time = task?.time
      const newTime =
        time && _.mapValues(time, (t) => setDateTime({ date, time: t }))

      onChange({ startDate: date, time: newTime })
    },
    [navigate, task, onChange],
  )

  const update = useCallback(
    (payload: NewTaskFormPayload) => {
      const { startDate } = payload
      if (startDate) {
        onChangeDate(startDate)
      } else {
        onChange(payload)
      }
    },
    [onChange, onChangeDate],
  )

  const reset = useCallback(() => setTask(null), [])

  const value = useMemo(
    () => ({
      task,
      create,
      update,
      reset,
    }),
    [task, create, update, reset],
  )

  return (
    <NewTaskContext.Provider value={value}>{children}</NewTaskContext.Provider>
  )
}

export default NewTaskContextProvider

export const useNewTaskContext = () => {
  const context = useContext(NewTaskContext)
  if (!context)
    throw new Error('it should be inside of the new task context provider')

  return context
}
