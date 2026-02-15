import { useState } from 'react';
import './App.css'
import Flag from './components/flag.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Flag />
    </>
  )
}

export default App
