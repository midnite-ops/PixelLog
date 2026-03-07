import { countArrBackwards, formattedDate, toDateString } from "../utils/fileStructure"

export default function Activity({dataLogs}) {
    const files = countArrBackwards(dataLogs)
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
                {files.map((file, index) => {
                    const lastEvent = file.event.at(-1)
                    return(
                        <tr key={index}>
                            <>
                                <td className="border-b border-gray-300 p-4 ">{formattedDate(lastEvent.date)}</td>
                                <td className="border-b border-gray-300 p-4">{lastEvent.type}</td>
                                <td className="border-b border-gray-300 p-4">{file.fileName}</td>
                            </>
                        </tr>
                    )
                    
                })}
                
            </tbody>
        </table>
    </section>
  )
}
