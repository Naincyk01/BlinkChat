import React from 'react';

const RegisteredUserDisplay = ({ user , onClick }) => {
 
  return (
    <div className="flex items-start py-4 border-b border-[#C4C4C4] border-opacity-50" onClick={onClick}>
      <div className="border h-14 rounded-full w-14"></div>

      <div className="flex-1 flex flex-col">
        <div className="mb-1">
          <h3 className="text-lg font-semibold">{user.username}</h3>
          <p className="text-sm text-gray-700">{user.bio}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center flex-col">
        <div className="flex gap-x-1">
          <div className="text-xs text-gray-500">{user.lateSeen}</div>
        </div>
        <div>✅</div>
      </div>  
    </div>
  );
};

export default RegisteredUserDisplay;