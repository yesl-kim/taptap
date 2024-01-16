import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export const intervalToString = (start: Date, end: Date) => {
  const [startHalfDay, endHalfDay] = [start, end].map((time) =>
    format(time, 'aaa', { locale: ko })
  )
  const [startString, endString] = [start, end].map((time) =>
    format(time, 'h:mm')
  )

  if (startHalfDay === endHalfDay) {
    return `${startHalfDay} ${startString} ~ ${endString}`
  } else {
    return `${startHalfDay} ${startString} ~ ${endHalfDay} ${endString}`
  }
}
