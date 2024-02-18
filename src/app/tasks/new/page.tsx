import NewTaskForm from '@/containers/new-task/new-task-form'

export const dynamic = 'force-dynamic'

export default async function NewTaskPage() {
  return (
    <main className="flex flex-1 justify-center bg-white">
      <NewTaskForm />
    </main>
  )
}
