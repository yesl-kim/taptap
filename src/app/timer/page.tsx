import NewTask from '@/containers/new-task'

export default async function TimerPage() {
  return (
    <main className="bg-white">
      <div className="w-[600px]">
        <NewTask />
      </div>
    </main>
  )
}
