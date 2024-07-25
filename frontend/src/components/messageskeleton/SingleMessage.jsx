
import React from 'react';

const SingleMessage = ({ message,
   isOwnMessage
   }) => {
  const messageClass = isOwnMessage ? 'flex-row-reverse' : 'flex-row';


  return (
    <div className={`flex ${messageClass} gap-3 items-center mb-2`}>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-400">{message.sender.fullName}</p>
        <div className={`bg-gray-800 rounded-xl p-3 ${isOwnMessage ? '' : 'bg-primaryDark'}`}>
          <p className="text-white">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
