import { useEffect, useState } from 'react'
import { Button } from 'ui'

const API_URL = 'http://localhost:4000/'

export default function Web() {
  const [state, setState] = useState()
  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then(setState)
  }, [])

  return (
    <div>
      <Button />
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  )
}
