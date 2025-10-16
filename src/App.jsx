import { FiUpload } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { useState } from 'react'

function App() {
  return (
    <div className='min-h-screen flex justify-center px-4 py-16  bg-bg'>
      <div className='w-full max-w-4xl flex flex-col gap-16'>
          <header className='flex flex-col items-center gap-4'>
            <h1 className='text-2xl font-medium'>Email Phisher Detector</h1>
              <p className='text-neutral-500 text-xl'>Check if an email will phish your data!</p>
          </header>

          <main className='flex-1 flex flex-col gap-8'>
            <div className='p-6 bg-white shadow-lg rounded-lg border border-neutral-200 flex flex-col gap-6'>
              <textarea 
                placeholder="Enter the email body here..."
                className='resize-none w-full h-[300px]  outline-none overflow-y-auto'
              ></textarea>
              <div className='flex justify-between items-center'>
                <div className='flex gap-4'>
                  <button className='bg-primary px-4 py-2 text-white rounded-md'>Detect Phisphing</button>
                  <button className='border border-primary text-primary px-4 py-2 rounded-md cursor-pointer'>
                    <div className='flex gap-2 items-center'>
                      <FiUpload/>
                      Upload File
                    </div>
                  </button>
                </div>
                <div className='text-neutral-500 flex gap-2'>
                  <span>102 Words and </span>
                  <span>2300 Characters</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 grid-rows-[342px]">

              <div className="p-6 bg-white shadow-lg rounded-lg border border-neutral-200 flex flex-col gap-6">
                <div className="h-full flex flex-col justify-center items-center gap-4">
                  <div className="text-center">
                    <h2 className="text-xl">The email is</h2>
                    <span className="text-red-500 text-2xl font-medium">High Risk</span>
                  </div>
                  <div className="text-4xl bg-red-500 rounded-full p-4 text-white">5+</div>
                  <p className="text-neutral-500 text-center">The email is highly likely to be a phishing thing (idk)</p>
                </div>
              </div>

              <div className="p-6 bg-white shadow-lg rounded-lg border border-neutral-200 flex flex-col gap-6">
                <h2 className="text-xl">Reasons</h2>
                <div className="overflow-y-auto">
                  <ul className="flex flex-col gap-4 items-center">
                    <li className="text-red-500 flex gap-2">
                      <MdErrorOutline size={20} className="flex-shrink-0"/>
                      <span>Detected urgent keyword: 'account suspended'</span> 
                    </li>
                    <li className="text-red-500 flex gap-2">
                      <MdErrorOutline size={20} className="flex-shrink-0"/>
                      <span>Detected a generic greeting: 'Dear Valued Customer</span> 
                    </li>
                    <li className="text-red-500 flex gap-2">
                      <MdErrorOutline size={20} className="flex-shrink-0"/>
                      <span>Found a misleading link where the text did not match the destination.</span>  
                    </li>
                    <li className="text-red-500 flex gap-2">
                      <MdErrorOutline size={20} className="flex-shrink-0"/>
                      <span>Found a misleading link where the text did not match the destination.</span>  
                    </li>
                    <li className="text-red-500 flex gap-2">
                      <MdErrorOutline size={20} className="flex-shrink-0"/>
                      <span>Found a misleading link where the text did not match the destination.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            </main>
          </div>
       </div>
  )
}

export default App
