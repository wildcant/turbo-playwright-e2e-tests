import Link from 'next/link'
import React from 'react'

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <strong>Monorepo E2E Playground</strong>
        </li>
      </ul>
      <ul>
        <li>
          <Link href={'/'}>Home</Link>
        </li>
        <li>
          <Link href={'/todos'}>Todos</Link>
        </li>
        <li>
          <Link href={'/users'}>Users</Link>
        </li>
      </ul>
    </nav>
  )
}
