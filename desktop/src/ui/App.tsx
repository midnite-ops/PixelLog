import { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <section className='bg-primary h-screen font-inherit text-white'>
      <Sidebar />

      <main>
        <Outlet />
      </main>
    </section>
  )
}

export default App
