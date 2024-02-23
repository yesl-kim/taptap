import { getCategories } from '@/actions/category/get-categories'
import Category from '@/containers/category'
import NewCategory from '@/containers/new-category'

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
