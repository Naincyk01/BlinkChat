import React from 'react';

const UserToChatDisplay = ({ user, onClick }) => {
  return (
    <div
      className="flex items-center justify-between h-full w-full py-2 mb-1 border-b border-[#C4C4C4] border-opacity-50"
      onClick={onClick}
    > 
       <div className='flex gap-x-3'>

        <div className="border h-14 rounded-full w-14 flex justify-center items-center">
          <img src={user.profilepic} className="h-full w-full rounded-full" alt="Profile Picture" />
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{user.fullName}</h3>
          <p className="text-sm text-gray-700">{""}</p>
          {/* yaha chaiye latest message  */}
        </div>

       </div>
        <div className="flex flex-col gap-y-2">
          <div className="text-xs text-gray-500 flex">{user.bio}</div>
          {/* yaha chaiye latest message ka time and date */}
          <div className='flex justify-end'>✅</div>
        </div>


    </div>
  );
};

export default UserToChatDisplay;
