import { getCategories } from '@/actions/get-categories'

import Category from './components/category'
import NewCategory from './components/new-category'

// TODO: 카테고리 없을 때
export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main>
      <ul>
        <NewCategory />
        {categories.map(({ id, title }) => (
          <li key={id}>
            <Category id={id} title={title} />
          </li>
        ))}
      </ul>
    </main>
  )
}
