import { set, startOfDay } from 'date-fns'

import DailyTaskRecordTimetable from '@/containers/daily-task-record-timetable'
import NavigationCalendar from '@/containers/navigation-calendar'

import Calendar from '@/components/calendar/calendar'

const today = set(startOfDay(new Date()), { hours: 4 })

type Params = {
  params: { dateArgs: string[] }
}

// date: [year, month, date]
// TODO: date params가 없을 때 redirect -> today를 써야해서 client로
// TODO: 이상한 날짜 입력했을 경우
export default async function DailySchedulePage({
  params: { dateArgs },
}: Params) {
  const [y, m, d] = dateArgs
  // NOTE: assert m = numberlike string
  const monthIndex = +m - 1 ?? 0
  const date = new Date(+y, monthIndex, +d)
  // console.log(dateArgs)
  // console.log(date)

  return (
    <main className="flex gap-1 w-full h-full bg-white">
      <NavigationCalendar />
      <DailyTaskRecordTimetable date={date} />
    </main>
  )
}
