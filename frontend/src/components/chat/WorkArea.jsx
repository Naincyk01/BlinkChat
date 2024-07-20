import React from 'react';
import { LuMessagesSquare } from 'react-icons/lu';

const WorkArea = () => {
  return (
    <div className="w-full h-screen bg-chatBg p-4">
      {/* <div className='flex flex-col justify-center items-center w-full h-full bg-[#0D0D0D] rounded-xl gap-6'>
        <div className='text-logoFontSize'>Welcome Naincy</div>
        <div className='text-logoFontSize'>Click  to start chat</div>
       <LuMessagesSquare className='text-primary' size={100}/>
       </div> */}

      <div className="bg-[#0D0D0D] h-full w-full rounded-xl p-4">
        <div className="flex items-start py-4 border-b">
          <div className="border h-14 rounded-full w-14"></div>

          <div className="flex flex-col pl-2">
            <div className="mb-1">
              <h3 className="text-lg font-semibold">Naincy</h3>
              <p className="text-sm text-gray-700">online</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default WorkArea;
