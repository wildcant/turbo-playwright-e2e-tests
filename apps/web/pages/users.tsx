import { useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export default function Users() {
  const [users, setUser] = useState<User[]>()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then((r) => r.json())
      .then((data) => setUser(data.users))
  }, [])

  return (
    <main className="container" style={{ paddingBlock: 100 }}>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">UserName</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Website</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.website}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
