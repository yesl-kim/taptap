import { format, getDay, setDay } from 'date-fns'
import { ko } from 'date-fns/locale'

const weekdays = Array.from({ length: 7 }).map((_, i) => setDay(new Date(), i))

// TODO: '오늘만' 체크박스 추가
export default function RepeatField() {
  return (
    <fieldset>
      <legend>반복 설정</legend>
      <div>
        <select>
          <option>반복 안함</option>
          <option>매주 반복</option>
        </select>
      </div>
      <div>
        {weekdays.map((day) => (
          <label key={day.toString()}>
            <span>{format(day, 'eee', { locale: ko })}</span>
            <input type="checkbox" value={getDay(day)} />
          </label>
        ))}
      </div>
    </fieldset>
  )
}
