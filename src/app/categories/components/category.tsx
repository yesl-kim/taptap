'use client'

import { memo, useCallback, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { CheckIcon } from '@heroicons/react/24/outline'

import useBoolean from '@/hooks/useBoolean'

import IconButton from '@/components/icon-button'
import { deleteCategory, updateCategory } from '../actions'

interface Props {
  id: string
  title?: string
}

function Category({ id, title }: Props) {
  const [state, update] = useFormState(updateCategory, null)
  const { pending } = useFormStatus()

  const inputRef = useRef<HTMLInputElement>(null)
  const focus = useCallback(() => inputRef?.current?.focus(), [])
  const { on: focused, turnOff: onBlur, turnOn: onFocus } = useBoolean(false)

  const onDelete = useCallback(async () => {
    const confirmed = confirm(
      '삭제 후에는 되돌릴 수 없습니다. 정말 삭제하시겠습니까?'
    )
    if (!confirmed) return

    const res = await deleteCategory(id)
    if (!res?.ok) {
      alert(res?.message)
    }
  }, [id])

  return (
    <form action={update} className="flex gap-4 items-center mb-3">
      <IconButton
        type="button"
        label="카테고리 삭제"
        Icon={TrashIcon}
        onClick={onDelete}
        disabled={pending}
      />
      <input type="hidden" name="id" value={id} />
      <input
        type="text"
        name="title"
        required
        ref={inputRef}
        defaultValue={title}
        onBlur={onBlur}
        onFocus={onFocus}
        className="outline-none bg-transparent focus:border-b-[1px] border-b-neutral-400"
      />
      <EditButton {...{ focused, focus }} />
      <p aria-live="polite" role="status" className="sr-only">
        {state?.message}
      </p>
    </form>
  )
}

interface EditButtonProps {
  focused: boolean
  focus: () => void
}

function EditButton({ focused, focus }: EditButtonProps) {
  const { pending } = useFormStatus()
  return focused ? (
    <IconButton
      key="submit"
      Icon={CheckIcon}
      label="카테고리 이름 변경"
      disabled={pending}
    />
  ) : (
    <IconButton
      key="edit"
      type="button"
      Icon={PencilIcon}
      label="카테고리 이름 변경"
      onClick={focus}
      disabled={pending}
    />
  )
}

export default memo(Category)
