import React, { useState, useRef, useEffect } from 'react';

const ChatBox = ({ selectedUser }) => {
  // Render only if selectedUser exists
  if (!selectedUser) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-chatBg p-4 flex">
      {/* Your chat UI */}
      <div className="flex flex-col w-full h-full bg-[#0D0D0D] border border-primaryLight border-opacity-50 rounded-xl gap-2">
        {/* Top section: Receiver's info */}
        <div className="flex items-start pb-3 border-b border-gray-600 p-4">
          <div className="border h-14 rounded-full w-14 bg-gray-600"></div>
          <div className="flex flex-col pl-2">
            <h3 className="text-lg font-semibold text-white">{selectedUser.name}</h3>
            <p className="text-sm text-gray-400">online</p>
          </div>
        </div>

        {/* Middle section: Display messages */}
        <div className="flex-1 overflow-y-auto mb-3 p-4"></div>

        {/* Bottom section: Input message */}
        <div className="flex items-center mt-auto p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 rounded-full py-2 px-4 focus:outline-none"
          />
          <button className="ml-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
