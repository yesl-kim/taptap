import ColorField from './components/color-field'
import RepeatField from './components/repeat-field'

// TODO: field 추가 - 제목, 카테고리, 색상, 시작일, 반복설정
// TODO: 각 필드 컴포넌트 분리
// TODO: style
// TODO: 공통 스타일 컴포넌트화
// - select
// - icon button + popover label
// TODO: 상수 or 기본값 관리

// category field ------
// TODO: 카테고리 조회
// TODO: 카테고리 추가 버튼 -> 카테고리 추가 모달 연결
// TODO: 카테고리가 없을 경우

// color filed -----
export default function TaskForm() {
  return (
    <form>
      <label>
        <span>제목</span>
        <input name="title" required />
      </label>

      <fieldset>
        <legend>카테고리</legend>
        <select name="categoryId" required>
          <option value="">카테고리</option>
          <option value={1}>카테고리 test1</option>
          <option value={2}>카테고리 test2</option>
        </select>
      </fieldset>

      <ColorField />

      <label>
        <span>시작일</span>
        <input type="datetime-local" />
      </label>

      <RepeatField />
    </form>
  )
}
