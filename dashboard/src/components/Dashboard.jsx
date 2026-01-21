import { toDateString } from "../utils/fileStructure"
export default function Dashboard({ dataLogs }) {

    let totalSaves = 0
    let totalExports = 0
    function lastItem(item){
        return item.length - 1
    }
    //Mapped through the dataLogs to calculate the totalSaves and exports of the whole logs
    dataLogs.map((session) => {
        session.event.map((sessionChild) => {
            if(sessionChild.type === 'save'){
                totalSaves++
            }else if(sessionChild.type === 'Expr'){
                totalExports++
            }
        })
    })

    const activityMetrics = [
        {name: 'Files Tracked', value: dataLogs.length},
        {name: 'Total Sessions', value: dataLogs.length},
        {name: 'Saves', value: totalSaves},
        {name: 'Exports', value: totalExports},
    ]
  return (
    <section >
        <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="mb-6">Track your files anytime, anywhere.</p>
            <div className="grid grid-cols-4 gap-6 mb-10">
                {activityMetrics.map((metric) => (
                    <div key={metric.name} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">{metric.name}</h3>
                        <p className="text-2xl">{metric.value}</p>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h2 className="text-3xl font-bold mb-6">Recent Activity</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border-b p-4 border-gray-300 text-left">File Name</th>
                            <th className="border-b p-4 border-gray-300 text-left">Action</th>
                            <th className="border-b p-4 border-gray-300 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataLogs.map((item, index) => (
                            <tr key={index}>
                                <td className="border-b border-gray-300 p-4">{item.fileName}</td>
                                <td className="border-b border-gray-300 p-4">{item.event[lastItem(item.event)].type}</td>
                                <td className="border-b border-gray-300 p-4">{toDateString(item.event[lastItem(item.event)].date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
    </section>
  )
}
