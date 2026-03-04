import { useState } from 'react'
import Sidebar from './components/Sidebar'
import FileLoader from './components/FileLoader'
import Dashboard from './components/Dashboard'
import Files from './components/Files'
import Activity from './components/Activity'

function App() {
  const [logs, setLogs] = useState([]);
  const [isLogs, setIsLogs] = useState(false);

  const handleLogs = (bool, data) => {
    setIsLogs(bool)
    setLogs(data)
  }

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Files", path: "/files" },
    { name: "Activity", path: "/activity" },
    { name: "Settings", path: "/settings" },
  ];

  const hanldeMenuClick = (link) => {
    setSelected(link)
  }

  const [selected, setSelected] = useState('Dashboard');

  return (
    <section className='ml-90 mr-10 h-screen'>
      <Sidebar menu={menu} selected={selected} onclick={hanldeMenuClick}/>
      <main className="py-10 w-full">
        {isLogs && (
          <>
            {selected === 'Dashboard' ? <Dashboard dataLogs={logs}/> : ''}
            {selected === 'Files' ? <Files dataLogs={logs}/> : ''}
            {selected === 'Activity' ? <Activity dataLogs={logs}/> : ''}
          </>
        )}
         
        {!isLogs && <FileLoader logsClick={handleLogs}/>}
      </main>
    </section>
  )
}

export default App
