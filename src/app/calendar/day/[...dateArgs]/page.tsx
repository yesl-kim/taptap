import { set, startOfDay } from 'date-fns'

import DailyTaskRecordTimetable from '@/containers/daily-task-record-timetable'
import NavigationCalendar from '@/containers/navigation-calendar/navigation-calendar'
import CalendarNavigator from '@/containers/navigation-calendar/navigator'
import NewTaskContextProvider from '@/containers/new-task/new-task-context'
import NewButton from '@/containers/new-task/new-button'

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

  return (
    <>
      <nav>
        <CalendarNavigator type="daily" />
      </nav>
      <main className="flex flex-1 gap-1 overflow-hidden">
        <aside>
          <NewButton />
          <NavigationCalendar />
        </aside>
        <DailyTaskRecordTimetable date={date} />
      </main>
    </>
  )
}
