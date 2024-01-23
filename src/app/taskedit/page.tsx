import _ from 'lodash'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getCategories } from '@/actions/category/get-categories'
import { createTask } from '@/actions/task/create-task'

import TaskForm from '@/components/task-form/task-form'

const searchParamsSchema = z.object({ state: z.optional(z.string()) })
const parsedSearchParamsSchema = searchParamsSchema.transform((params, ctx) => {
  try {
    const state = _.get(params, 'state')
    const parsed = state && JSON.parse(decodeURIComponent(state))
    return parsed
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid value',
    })
    return z.NEVER
  }
})
type SearchParams = z.infer<typeof searchParamsSchema>

export default async function NewTaskPage({
  searchParams,
}: PageProps<never, SearchParams>) {
  const [categories, task] = await Promise.all([
    getCategories(),
    parsedSearchParamsSchema.spa(searchParams),
  ])

  if (!task.success) {
    redirect('/taskedit')
  }

  return (
    <main className="w-full h-full bg-white">
      <TaskForm task={task.data} categories={categories} action={createTask} />
    </main>
  )
}
