import React from 'react';
import { format } from 'date-fns';

const SingleMessage = ({ message, isOwnMessage }) => {
  const messageClass = isOwnMessage ? 'flex-row-reverse' : 'flex-row';
  
  const formattedDate = format(new Date(message.createdAt), 'MMM d, yyyy h:mm a');


  return (
    <div className={`flex ${messageClass} gap-3 items-center mb-2`}>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-gray-400"> {isOwnMessage ? message.sender.fullName : 'me'}</p>
        <div className={`bg-gray-800 rounded-xl p-3 ${isOwnMessage ? '' : 'bg-primaryDark'}`}>
          <p className="text-white text-sm">{message.content}</p>
          <div className='flex justify-end'>
          <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
