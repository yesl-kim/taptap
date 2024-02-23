import { format } from 'date-fns'

import CalendarNavigator from '@/containers/navigation-calendar/navigator'
import DailyTaskRecordTimetable from '@/containers/daily-task-record-timetable'
import NavigationCalendar from '@/containers/navigation-calendar/navigation-calendar'
import NewButton from '@/containers/new-task/new-button'
import { parmasToDate } from '@/hooks/use-navigate-date/use-navigate-date.utils'

type Params = {
  params: { dateArgs: string[] }
}

export default async function DailySchedulePage({ params }: Params) {
  const date = parmasToDate(params) ?? new Date()
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="mb-4 flex min-h-[60px] items-center gap-4 border-b-[1px] border-gray-200 px-8">
        <CalendarNavigator type="daily" />
        <h1>{format(date, 'yyyy년 MM월 dd일')}</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex flex-col gap-4 px-2">
          <NewButton />
          <NavigationCalendar />
        </aside>
        <DailyTaskRecordTimetable date={date} />
      </div>
    </div>
  )
}
