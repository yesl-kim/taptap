import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth()
  return <main>{JSON.stringify(session)}</main>
}
