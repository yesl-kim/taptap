import Link from 'next/link'
import React from 'react'

export default async function Nav() {
  return (
    <ul>
      <li>
        <Link href="/api/auth/signout">logout</Link>
      </li>
      <li>
        <Link href="/api/auth/signin">login</Link>
      </li>
      <li>
        <Link href="/test">test</Link>
      </li>
    </ul>
  )
}
