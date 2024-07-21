import React from 'react';
import { LuMessagesSquare } from 'react-icons/lu';
import ChatBox from './ChatBox.jsx';
import Image1 from '../../assets/welcomeImage1.svg'
import Image2 from '../../assets/welcomeImage2.svg'

const WorkArea = () => {
  return (
    <div className="w-full h-screen bg-chatBg p-4">
      <div className='flex flex-col justify-center items-center w-full h-full bg-[#0D0D0D] rounded-xl gap-6 border border-primaryDark'>
      <div className='flex justify-center items-baseline'>
        <img src={Image2} alt="Second Image" className="w-48 h-72" />
        <img src={Image1} alt="First Image" className="h-48 w-48" />
      </div>
        
       <div>
        <div className='text-logoFontSize'>Connect easily with your friends and family...</div>
      
       </div>
        
        {/* Icon */}
        <LuMessagesSquare className='' size={50}/>
      </div>
      
      {/* Uncomment to display ChatBox component */}
      {/* <ChatBox/> */}
    </div>
  );
};

export default WorkArea;
