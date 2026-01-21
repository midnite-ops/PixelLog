import { lastItem, toDateString } from "../utils/fileStructure"
import { useState, useEffect } from "react"
import FileActivity from "./FileActivity"
export default function Files({ dataLogs }) {
    const files = dataLogs
    const [isActivity, setActivity] = useState(false)
    const [logItem, setLogItem] = useState(null)

    const getLog = (logsIndex) => {
        setLogItem(files[logsIndex])
        setActivity(true)
    }
    const closeActivity = () => {
        setActivity(false)
    }
  return (
    <section>
        <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Files & Activity</h1>
            <p>Clarity and Transparency</p>
        </div>
        {!isActivity && (
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-300 p-4 text-left">File Name</th>
                            <th className="border-b border-gray-300 p-4 text-left">Type</th>
                            <th className="border-b border-gray-300 p-4 text-left">Session</th>
                            <th className="border-b border-gray-300  p-4 text-left">Last Edited</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <tr key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => {getLog(index)}}>
                                <td className="border-b border-gray-300 p-4 ">{file.fileName}</td>
                                <td className="border-b border-gray-300 p-4">{file.event[lastItem(file.event)].fileType}</td>
                                <td className="border-b border-gray-300 p-4">9</td>
                                <td className="border-b border-gray-300 p-4">{toDateString(file.event[lastItem(file.event)].date)}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>
        )}

        {isActivity && (
            <FileActivity close = {closeActivity} file= {logItem}/>
        )}
         
    </section>
  )
}
