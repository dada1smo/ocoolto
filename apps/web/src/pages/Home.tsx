import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Home() {
  const [status, setStatus] = useState('...')

  useEffect(() => {
    api.health
      .$get()
      .then((res) => res.json())
      .then((data) => setStatus(`api ${data.status}`))
      .catch(() => setStatus('api offline'))
  }, [])

  return (
    <main>
      <h1>ocoolto</h1>
      <p>{status}</p>
    </main>
  )
}
