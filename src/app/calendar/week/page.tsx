import TaskTimeBlock from '@/containers/task-time-block/task-time-block'

const task = {
  title: '할 일 1',
  color: '#000000',
  category: 'test',
  startTime: new Date(),
  endTime: new Date(),
}

export default function CalendarPage() {
  return (
    <div className="w-[120px]">
      <TaskTimeBlock task={task} date={new Date()} />
    </div>
  )
}
