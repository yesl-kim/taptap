'use client'

import { memo, useCallback, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createCategory } from '../actions'

import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import useBoolean from '@/lib/useBoolean'

function NewCategory() {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { on: focused, turnOn: onFocus, turnOff: onBlur } = useBoolean()

  const focus = useCallback(() => inputRef?.current?.focus(), [])
  const submit = useCallback((prev: any, data: FormData) => {
    formRef?.current?.reset()
    return createCategory(prev, data)
  }, [])

  const [state, formAction] = useFormState(submit, null)

  return (
    <form action={formAction} ref={formRef} className="flex gap-2 items-center">
      <InputController focus={focus} focused={focused} />
      <input
        type="text"
        name="title"
        aria-label="새 카테고리 생성"
        placeholder="새 카테고리 생성"
        required
        className="peer"
        ref={inputRef}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {focused && <SubmitButton />}
      <p aria-live="polite" role="status" className="sr-only">
        {state?.message}
      </p>
    </form>
  )
}

export default memo(NewCategory)

interface InputControllerProps {
  focused: boolean
  focus: () => void
}

const style = {
  iconButton: 'w-[30px] p-1.5 group hover:bg-slate-200 rounded-full',
  icon: 'group-hover:stroke-black stroke-slate-500 stroke-2',
}

function InputController({ focused, focus }: InputControllerProps) {
  return focused ? (
    <button
      type="reset"
      aria-label="카테고리 추가 취소"
      className={style.iconButton}
    >
      <XMarkIcon aria-hidden className={style.icon} />
    </button>
  ) : (
    <button
      type="button"
      aria-label="새 카테고리 생성"
      className={style.iconButton}
      onClick={focus}
    >
      <PlusIcon aria-hidden className={style.icon} />
    </button>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      aria-label="새 카테고리 생성"
      aria-disabled={pending}
      className={style.iconButton}
    >
      <CheckIcon aria-hidden className={style.icon} />
    </button>
  )
}
