import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import { Period } from '@/types/schema'

export const intervalToString = ({ start, end }: Period) => {
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
