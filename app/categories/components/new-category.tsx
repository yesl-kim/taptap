'use client'

import { useFormState } from 'react-dom'
import { createCategory } from '../actions'

// TODO: style
// TODO: loading
// TODO: input active 상태에 따라 취소, 추가 버튼의 아이콘 변경
// - 취소: active ? x (취소) : + (생성)
// - 추가: active ? ✔️ (생성) : 없음

export default function NewCategory() {
  const [state, formAction] = useFormState(createCategory, null)
  console.log('state: ', state)

  return (
    <form action={formAction}>
      <button type="reset" aria-label="카테고리 추가 취소">
        <i aria-hidden>dismiss</i>
      </button>
      <input
        type="text"
        name="title"
        aria-label="새 카테고리 생성"
        placeholder="새 카테고리 생성"
        required
      />
      <button type="submit" aria-label="카테고리 생성">
        <i aria-hidden>check</i>
      </button>
      {state?.message ?? (
        <p aria-live="polite" role="status">
          {state?.message}
        </p>
      )}
    </form>
  )
}
