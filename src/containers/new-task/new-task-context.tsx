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

import { NewTaskFormField, NewTaskFormInput } from './new-task-form.types'

type NewTaskContextType = {
  task: Partial<NewTaskFormField> | null
  create: (datetime?: Date) => void
  update: (task: Partial<NewTaskFormField>) => void
  reset: () => void
}

const NewTaskContext = createContext<null | NewTaskContextType>(null)

/*
[ ] type
[ ] jotai
[ ] reducer
*/

const NewTaskContextProvider = ({ children }: PropsWithChildren) => {
  const { today } = useToday()
  const [task, setTask] = useState<null | NewTaskFormInput>(null)

  const create = useCallback(
    (datetime?: Date) => {
      const startDate = datetime ?? today
      const startTime = datetime ?? round30Minutes(new Date())
      const endTime = addHours(startTime, 1)

      const initialTask: NewTaskFormField = {
        title: '',
        color: defaultColorOptions[0],
        category: {
          title: '',
        },
        startDate,
        time: { start: startTime, end: endTime },
      }

      setTask(initialTask)
    },
    [today],
  )

  const update = useCallback((payload: NewTaskFormInput) => {
    setTask((prev) => {
      if (!prev) {
        return payload
      }

      return { ...prev, ...payload }
    })
  }, [])

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
