// time field ---
// - 컨트롤 가능해야해서 input 이 아닌 select로
// TODO: 시간 설정 안함
// TODO: 시간 구간 삭제
// TODO: 구간 추가 - 이미 선택된 구간 이후로만 선택 가능
// TODO: 모든 요일에 시간 복사 - 7개의 timeField를 감싸는 context 필요
// - repeat field에서 time field 7개를 사용하는 것이 아니라
// - context(time field * 7)를 감싸는 부모 컴포넌트 필요
// 사투리 넘나 매력적... 왜 사투리 쓰는 사람들은 목소리도 매력있지

interface TimeFieldProps {
  day: string // FIXME: type. 몇 요일
}

// 요일 하나당 시간 설정 field
export default function TimeField() {
  return (
    <div>
      <span>요일</span>
      TODO: 추가 가능
      <div>{/* <TimeSelect /> */}</div>
      <div>
        <button type="button">기간 추가</button>
        <button type="button">모든 요일에 기간 복사</button>
      </div>
    </div>
  )
}
