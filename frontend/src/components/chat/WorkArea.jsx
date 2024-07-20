import React from 'react'
import { LuMessagesSquare } from "react-icons/lu";

const WorkArea = () => {
  return (
    <div className='w-full h-screen bg-chatBg p-4'>

       <div className='flex flex-col justify-center items-center w-full h-full bg-[#0D0D0D] rounded-xl gap-6'>
        <div className='text-logoFontSize'>Welcome Naincy</div>
        <div className='text-logoFontSize'>Click  to start chat</div>
       <LuMessagesSquare className='text-primary' size={100}/>
       </div>

       <div>
        
       </div>
    </div>
  )
}

export default WorkArea