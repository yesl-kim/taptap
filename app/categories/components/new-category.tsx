'use client'

import { memo, useCallback, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createCategory } from '../actions'

import { PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import useBoolean from '@/lib/useBoolean'

import IconButton, { style } from '@/components/icon-button'

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
    <div className="mb-3">
      <form
        action={formAction}
        ref={formRef}
        className="flex gap-4 items-center"
      >
        <InputController focus={focus} focused={focused} />
        <input
          type="text"
          name="title"
          aria-label="새 카테고리 생성"
          placeholder="새 카테고리 생성"
          required
          ref={inputRef}
          onFocus={onFocus}
          onBlur={onBlur}
          className="outline-none bg-transparent focus:border-b-[1px] border-b-neutral-400"
        />
        {focused && (
          <IconButton
            type="submit"
            aria-label="새 카테고리 생성"
            Icon={CheckIcon}
          />
        )}
      </form>
      {state?.ok ? (
        <p aria-live="polite" role="status" className="sr-only">
          {state.message}
        </p>
      ) : (
        state && (
          <p
            aria-live="polite"
            role="status"
            className="text-sm text-red-600 pl-2"
          >
            {state.message}
          </p>
        )
      )}
    </div>
  )
}

export default memo(NewCategory)

interface InputControllerProps {
  focused: boolean
  focus: () => void
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
