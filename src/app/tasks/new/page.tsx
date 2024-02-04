import NewTaskForm from '@/containers/new-task/new-task-form'

export default async function NewTaskModal() {
  return (
    <main className="flex flex-1 justify-center bg-white">
      <NewTaskForm />
    </main>
  )
}
