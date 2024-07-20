import React from 'react';
import RegisteredUserDisplay from '../messageskeleton/RegisteredUserDisplay.jsx';
const SideBar = () => {
  const inputStyles =
    'w-full h-10 rounded-xl px-4 text-black text-sm border border-[#BCBEC0] focus:border-primaryDark focus:outline-none bg-[#0D0D0D] text-sm';

  const inputContainerStyles = 'w-full';
  return (
    <div className="h-auto w-auto p-4 flex">
      {/* Side Bar */}
      <div className="bg-primary flex flex-col justify-between items-center w-[162px] rounded-lg p-4 gap-10">
        {/* Photo */}
        <div className="border h-20 rounded-full w-20"></div>

        {/* Icons */}
        <div className="flex flex-col gap-8">
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Home</div>
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Notification</div>
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Message</div>
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Setting</div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center items-center p-3 rounded-lg mb-4">
          <div>Logout Button</div>
        </div>
      </div>

      {/* Search and Chat User */}
      <div className="w-[350px] h-full flex flex-col pl-6 gap-6">
        <div className={`${inputContainerStyles}`}>
          {/* Search Input */}
          <input type="text" className={`${inputStyles}`} placeholder="Search users..." />
        </div>

       
          <div className="bg-[#0D0D0D] rounded-md pl-4 shadow-md border h-auto overflow-y-auto">People
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
           <RegisteredUserDisplay/>
          {/* <div className="bg-[#0D0D0D] rounded-md h-[269px] pl-4 shadow-sm border">names</div> */}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
