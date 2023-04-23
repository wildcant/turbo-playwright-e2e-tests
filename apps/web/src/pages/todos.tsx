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
    <main className="container" style={{ paddingBlock: 10 }}>
      <h1>TODOs</h1>
      <p>Coming from sql db</p>
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
