import { createTask } from '@/app/timer/actions/create-task'

import ColorField from './components/color-field'
import RepeatField from './components/repeat-field/repeat-field'
import CategoryField from './components/category-field'

export default async function TaskForm() {
  return (
    <form action={createTask}>
      <input name="title" required placeholder="제목" />

      <div className="flex gap-2 items-center">
        <CategoryField />
        <ColorField />
      </div>

      <RepeatField />
      <button>완료</button>
    </form>
  )
}
