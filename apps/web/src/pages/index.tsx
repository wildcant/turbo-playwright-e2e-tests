import { useEffect, useState } from 'react'

export default function Home() {
  const [state, setState] = useState()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
      .then((r) => r.json())
      .then(setState)
  }, [])

  return (
    <div className="container">
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}
