import { useContext, useEffect } from 'react'
import GlobalContext from '../utils/globalContext'
export default function ToolTip() {
  const value = useContext(GlobalContext)
  const handleMouseEnter = ()=>{
    //暂停动画，
    value.changePaused('paused')


  }
  const handleMouseLeave=()=>{
    //开始动画
    value.changePaused('running')
  }
  const remove=()=>{
    //关闭提示
    value.changeRemove(true)

  }
  useEffect(()=>{
    document.getElementById('timer')?.addEventListener('animationend',()=>{
      value.changeRemove(true)      
    })

  },[value.isRemoveTooltip])

  if (!value.isRemoveTooltip) {
    return (
      <div className="Toastify__toast-container Toastify__toast-container--top-right" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={remove}>
        <div id="3" className="Toastify__toast Toastify__toast-theme--light Toastify__toast--default Toastify__toast--close-on-click">
          <div role="alert" className="Toastify__toast-body">
            <div>Something went wrong importing your PDF</div>
          </div>
          <button className="Toastify__close-button Toastify__close-button--light" type="button" aria-label="close">
            <svg aria-hidden="true" viewBox="0 0 14 16">
              <path fillRule="evenodd" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"></path>
            </svg>
          </button>
          <div
            id="timer"
            role="progressbar"
            aria-hidden="false"
            aria-label="notification timer"
            className="Toastify__progress-bar Toastify__progress-bar--animated Toastify__progress-bar-theme--light Toastify__progress-bar--default"
            style={{ animationDuration: '5000ms', animationPlayState: `${value.isPaused}`, opacity: '1' }}
          ></div>
        </div>
      </div>
    )
  } else {
    return
  }
}
