'use client'

import React, { useState,useContext } from 'react'
import PdfView from './components/pdfView'
import GlobalContext from './utils/globalContext'

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const value = useContext(GlobalContext)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files[0]) {
      setIsActive(() => true)
      setPdfFile(() => event.target.files[0])
    }
  }
  const handleDragOver = (event) => {
    event.preventDefault()
    return false
  }

  const handleDrop = (event): void => {
    event.preventDefault()
    const files = event.dataTransfer.files

    if (files[0].type == 'application/pdf') {
      setIsActive(() => true)
      setPdfFile(() => files[0])
    } else {
      //文件类型错误，开启错误提示
      value.changeRemove(false)
      value.changePaused('running')

    }
  }

  return (
    <div className="bg-[#f7f5ee] text-black">
      <div className="container mx-auto py-20 space-y-5">
        <div className="flex flex-col text-center !mb-10 space-y-5">
          <h1 className="text-5xl font-serif">Rotate PDF Pages</h1>
          <p className="mt-2 text-gray-600 max-w-lg mx-auto">Simply click on a page to rotate it. You can then download your modified PDF.</p>
        </div>

        {isActive ? (
          <PdfView pdf={pdfFile} setPdf={setPdfFile} setActive={setIsActive} />
        ) : (
          <div className="w-full flex justify-center">
            <div className="h-[350px] relative text-center w-[275px]" onDragOver={handleDragOver} onDrop={handleDrop}>
              <input className="cursor-pointer hidden" type="file" id="input-file-upload" accept=".pdf" onChange={handleFileChange} />
              <label className="h-full flex items-center justify-center border rounded transition-all bg-white border-dashed border-stone-300" htmlFor="input-file-upload">
                <div className="cursor-pointer flex flex-col items-center space-y-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"></path>
                  </svg>
                  <p className="pointer-events-none font-medium text-sm leading-6 pointer opacity-75">Click to upload or drag and drop</p>
                </div>
              </label>
            </div>
          </div>
        )}
        <div className="flex flex-wrap justify-center"></div>
      </div>
    </div>
  )
}
