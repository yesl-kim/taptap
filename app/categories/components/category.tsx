'use client'

import { useCallback } from 'react'
import { useFormState } from 'react-dom'
import { deleteCategory, updateCategory } from '../actions'

interface Props {
  id: string
  title?: string
}

// TODO: inactive && 라벨 이름 바꾸기 -> focus
// TODO: active && 라벨 이름 바꾸기 -> submit
export default function Category({ id, title }: Props) {
  const [state, update] = useFormState(updateCategory, null)
  const $delete = useCallback(async () => {
    const confirmed = confirm(
      '삭제 후에는 되돌릴 수 없습니다. 정말 삭제하시겠습니까?'
    )
    if (!confirmed) return

    const res = await deleteCategory(id)
    if (res?.message) {
      alert(res?.message)
    }
  }, [id])

  return (
    <form action={update}>
      <button type="button" onClick={$delete}>
        삭제
      </button>
      <input type="hidden" name="id" value={id} />
      <input type="text" name="title" required defaultValue={title} />
      <button type="submit">라벨 이름 바꾸기</button>
    </form>
  )
}
