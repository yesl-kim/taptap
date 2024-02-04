import { set, startOfDay } from 'date-fns'

import DailyTaskRecordTimetable from '@/containers/daily-task-record-timetable'
import NavigationCalendar from '@/containers/navigation-calendar/navigation-calendar'
import CalendarNavigator from '@/containers/navigation-calendar/navigator'
import NewButton from '@/containers/new-task/new-button'
import { parmasToDate } from '@/hooks/use-navigate-date/use-navigate-date.utils'

type Params = {
  params: { dateArgs: string[] }
}

export default async function DailySchedulePage({ params }: Params) {
  const date = parmasToDate(params) ?? new Date()
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
