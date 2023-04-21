import { useEffect, useState } from 'react'

type Todo = {
  _id: string
  title: string
  completed: boolean
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`)
      .then((r) => r.json())
      .then((data) => setTodos(data.todos))
  }, [])

  return (
    <main className="container" style={{ paddingBlock: 100 }}>
      <h1>TODOs</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Completed</th>
          </tr>
        </thead>
        <tbody>
          {todos?.map((todo) => (
            <tr key={todo._id}>
              <td>{todo.title}</td>
              <td>{String(todo.completed)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
