import { getCategories } from '@/actions/category/get-categories'

export const GET = async () => {
  try {
    const data = await getCategories()
    return Response.json({ success: true, data })
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 })
  }
}
