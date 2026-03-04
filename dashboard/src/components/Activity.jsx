import { countObjectItems } from "../utils/fileStructure"

export default function Activity({dataLogs}) {
    const files = dataLogs
  return (
    <section>
        <table className="w-full table-auto">
            <thead>
                <tr>
                    <th className="border-b border-gray-300 p-4 text-left">Time</th>
                    <th className="border-b border-gray-300 p-4 text-left">Event</th>
                    <th className="border-b border-gray-300 p-4 text-left">File</th>
                </tr>
            </thead>
            <tbody>
                {files.map((file, index) => (
                    <tr key={index} className="cursor-pointer hover:bg-gray-100">
                        {countObjectItems(file.event).map((item) => (
                            <>
                                <td className="border-b border-gray-300 p-4 ">{item.date}</td>
                                <td className="border-b border-gray-300 p-4">{item.type}</td>
                                <td className="border-b border-gray-300 p-4">{file.fileName}</td>
                            </>
                        ))}
                    </tr>
                ))}
                
            </tbody>
        </table>
    </section>
  )
}
