import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

import Category from './components/category'
import NewCategory from './components/new-category'

// TODO: 카테고리 없을 때
export default async function CategoriesPage() {
  const session = await auth()
  const categories = await prisma.category.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

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
