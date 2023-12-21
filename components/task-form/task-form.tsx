import { createTask } from '@/app/timer/actions/create-task'
import ColorField from './components/color-field'
import RepeatField from './components/repeat-field'
import CategoryField from './components/category-field'
import prisma from '@/lib/prisma'

// TODO: field 추가 - 제목, 카테고리, 색상, 시작일, 반복설정
// TODO: 각 필드 컴포넌트 분리
// TODO: style
// TODO: 공통 스타일 컴포넌트화
// - select
// - icon button + popover label
// TODO: 상수 or 기본값 관리

// category field ------
// TODO: 카테고리 조회 -> 내 것만 가져오도록, util로 수정
// TODO: 카테고리 추가 버튼 -> 카테고리 추가 모달 연결
// TODO: 카테고리가 없을 경우

// color filed -----
export default async function TaskForm() {
  return (
    <form action={createTask}>
      <input name="title" required placeholder="제목" />

      <div className="flex gap-2 items-center">
        <CategoryField />
        <ColorField />
      </div>

      <RepeatField />
      <button>완료</button>
    </form>
  )
}
