import React from 'react'
import { totalItems, formattedDate, countObjectItems } from '../utils/fileStructure'
export default function({ file, close }) {

    
  return (
    <div className='border-gray-300 border rounded-md relative h-fit w-full p-10'>
        <div className='absolute top-0 right-10 p-5 rounded-full cursor-pointer font-semibold text-base' onClick={() => {close()}}>X</div>
        <div className='grid grid-cols-2 grid-rows-2 gap-10 mb-10  '>
            <div>
                <h1 className='text-2xl mb-2'>File Name</h1>
                <p>{file.fileName}</p>
            </div>

            <div>
                <h1 className='text-2xl mb-2'>File Path</h1>
                <p>{file.filePath}</p>
            </div>

            <div>
                <h1 className='text-2xl mb-2'>Total Saves</h1>
                <p>{totalItems(file, 'save')}</p>
            </div>

            <div>
                <h1 className='text-2xl mb-2'>Total Exports</h1>
                <p>{totalItems(file, 'Export')}</p>
            </div>
            
        </div>
        

        <div>
            <h1 className='text-2xl mb-5'>Event History</h1>
            <div className='flex flex-col gap-10'>
                {file.event.map((item, index) => (
                    <div key={index} className='border border-gray-300 rounded-md p-5'>
                        <div className='mb-8'>
                            <h3 className='mr-2 inline'>Upoloaded On:</h3>
                            <p className='inline'>{formattedDate(item.date)}</p>
                        </div>
                        <div className='grid grid-cols-3 gap-5'>

                              <div className='border border-gray-300 p-5 rounded-lg relative'>
                                
                                <h3 className='font-semibold text-lg mb-2'>File History</h3>
                                {countObjectItems(item.history).map((item) => (
                                    <p>{item}</p>
                                ))}
                            </div>

                            <div className='border border-gray-300 p-5 rounded-lg'>
                                <h3 className='font-semibold text-lg mb-2'>File type</h3>
                                <p>{item.fileType}</p>
                            </div>

                            <div className='border border-gray-300 p-5 rounded-lg'>
                                <h3 className='font-semibold text-lg mb-2'>Event type</h3>
                                <p>{item.type}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
        
    </div>
  )
}
