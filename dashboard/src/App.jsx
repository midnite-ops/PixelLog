import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from './components/Sidebar'
import FileLoader from './components/FileLoader'

function App() {

  return (
    <>
      <Sidebar />
      <FileLoader />
    </>
  )
}

export default App
