'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { addHours } from 'date-fns'

import useToday from '@/hooks/useToday'
import { defaultColorOptions } from '@/constants/task.constants'
import { round30Minutes } from '@/utils/datetime'

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

      const time = { start: datetime, end: addHours(datetime, 1) }
      setTask({
        ...defaultTask,
        startDate: datetime,
        time,
      })
    },
    [defaultTask],
  )

  const update = useCallback(
    (payload: NewTaskFormPayload) => {
      setTask((prev) => {
        if (!prev) return { ...defaultTask, ...payload }
        return { ...prev, ...payload }
      })
    },
    [defaultTask],
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
