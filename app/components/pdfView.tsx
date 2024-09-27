import { useState, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import onCustomRenderer from './customRenderer'

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

export default function PdfView(props) {
  const { pdf, setPdf, setActive } = props
  const [numPages, setNumPages] = useState<number>()
  const [pageWidth, setPageWidth] = useState<number>(200)
  const [pageRotate, setPageRotate] = useState<any>([])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
    setPageRotate([...Array.from({ length: numPages }, () => 0)])
  }
  function removePdf(): void {
    setActive(() => false)
    setPdf(() => null)
  }

  function zoomIn(): void {
    setPageWidth((prePageWidth): number => {
      if (prePageWidth >= 500) {
        return 500
      }
      return prePageWidth + 50
    })
  }
  function zoomOut(): void {
    setPageWidth((prePageWidth): number => {
      if (prePageWidth <= 100) {
        return 100
      }
      return prePageWidth - 50
    })
  }

  function changeRatate(type: string, index?: number): void {
    if (type == 'rotateAll') {

      setPageRotate((pageRotate) => {
        const newArr = pageRotate.map((v) => {
          if (v >= 270) {
            return 0
          } else {
            return v + 90
          }
        })

        return [...newArr]
      })
    } else if (type == 'rotateOne') {
      setPageRotate((pageRotate) => {
        if (pageRotate[index] >= 270) {
          pageRotate[index] = 0
        } else {
          pageRotate[index] = pageRotate[index] + 90
        }
        return [...pageRotate]
      })
    }
  }
  function downLoad(event): void {
    event.preventDefault()
    event.stopPropagation()
    const reader = new FileReader()
    //使用readAsArrayBuffer读取文件内容为二进制数据，result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象。
    reader.readAsArrayBuffer(pdf)
    //使用FileReader API读取文件内容为数据URL
    // reader.readAsDataURL(pdf)
    reader.onload = (event) => {

      const data = event.target.result
      //创建一个Blob对象来存储文件内容
      const blob = new Blob([data], { type: 'application/pdf' })
      //使用URL.createObjectURL()方法生成一个下载链接
      const url = URL.createObjectURL(blob)
      //创建a标签下载
      const a = document.createElement('a')
      a.href = url
      a.download = pdf.name.replace(/\.pdf$/g,"(pdf.ai-rotated).pdf")
      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  if (pdf) {
    return (
      <div>
        <div className="flex justify-center items-center space-x-3 selecto-ignore">
          <button className="sc-7ff41d46-0 aEnZv !w-auto" onClick={() => changeRatate('rotateAll')}>
            Rotate all
          </button>
          <button className="sc-7ff41d46-0 aEnZv !w-auto !bg-gray-800 tooltips" aria-label="Remove this PDF and select a new one" data-microtip-position="top" role="tooltip" onClick={removePdf}>
            Remove PDF
          </button>
          <button className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white tooltips" aria-label="Zoom in" data-microtip-position="top" role="tooltip" onClick={zoomIn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"></path>
            </svg>
          </button>
          <button className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 grow-0 shrink-0 disabled:opacity-50 !bg-white tooltips" aria-label="Zoom out" data-microtip-position="top" role="tooltip" onClick={zoomOut}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"></path>
            </svg>
          </button>
        </div>
        {/* 主页面 */}
        <div className="flex flex-wrap justify-center pdf-wrap">
          <div className="pdfContainer">
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} className="flex flex-wrap justify-center">
              {new Array(numPages).fill('').map((cur, index) => (
                <div key={index} className="cursor-pointer overflow-hidden relative flex flex-col justify-between items-center shadow-md p-3 bg-white hover:bg-gray-50 m-3 box-border" onClick={() => changeRatate('rotateOne', index)} style={{ height: `${(pageWidth + 4) * 1.41}px` }}>
                  <div style={{ width: `${pageWidth - 24}px`, flex: `0 0 ${pageWidth}px`, height: `${(pageWidth + 4) * 1.41 - 24}px` }} className="pointer-events-none w-full shrink flex items-center">
                    <div className="absolute z-10 top-1 right-1 rounded-full p-1 hover:scale-105 hover:fill-white bg-[#ff612f] fill-white">
                      <svg className="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"></path>
                      </svg>
                    </div>
                    <Page pageNumber={index + 1} pageIndex={index + 1} renderTextLayer={false} renderAnnotationLayer={false} className="pointer-events-none shrink deepPage" rotate={pageRotate[index]} renderMode="custom" customRenderer={onCustomRenderer} />
                  </div>
                  <div className="w-[90%] text-center shrink-0 text-xs italic overflow-hidden text-ellipsis whitespace-nowrap">{index + 1}</div>
                </div>
              ))}
            </Document>
          </div>
        </div>
        {/* 底部下载按钮 */}
        <div className="flex flex-col justify-center items-center space-y-3 selecto-ignore pdf-wrap">
          <button className="sc-7ff41d46-0 aEnZv !w-auto shadow tooltips" aria-label="Split and download PDF" data-microtip-position="top" role="tooltip" onClick={downLoad}>
            Download
          </button>
        </div>
      </div>
    )
  }
  return
}
