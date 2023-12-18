import prisma from '@/lib/prisma'
import Category from './components/category'
import NewCategory from './components/new-category'
import { auth } from '@/lib/auth'

// TODO: 카테고리 추가 new-category
// TODO: 카테고리 조회 및 map category
// TODO: category 수정
// TODO: category 삭제

export default async function CategoriesPage() {
  const session = await auth()
  const categories = await prisma.category.findMany({
    where: {
      user: {
        email: session?.user?.email,
      },
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
