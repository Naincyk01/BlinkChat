import React from 'react'
import Sidebar from "../components/sidebar/SideBar.jsx";
import WorkArea from "../components/chat/WorkArea.jsx"

const ChatInterface = () => {
  return (
    <div className='w-full h-screen flex bg-chatBg text-white'>
      <Sidebar/>
      <WorkArea/>
    </div>
  )
}

export default ChatInterface