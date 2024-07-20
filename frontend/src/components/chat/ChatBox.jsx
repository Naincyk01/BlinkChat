import React, { useState, useRef, useEffect } from 'react';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef(null);

  // Function to handle sending a message
  const sendMessage = () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      content: inputMessage,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  // Function to scroll to the bottom of the chat container
  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="bg-[#0D0D0D] h-full w-full rounded-xl p-4 flex flex-col">
      {/* Top section: Receiver's info */}
      <div className="flex items-start pb-3 border-b border-gray-600">
        <div className="border h-14 rounded-full w-14 bg-gray-600"></div>
        <div className="flex flex-col pl-2">
          <h3 className="text-lg font-semibold text-white">Naincy</h3>
          <p className="text-sm text-gray-400">online</p>
        </div>
      </div>

      {/* Middle section: Display messages */}
      <div className="flex-1 overflow-y-auto mb-3" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`bg-gray-800 rounded-lg p-2 max-w-xs break-words ${message.sender === 'You' ? 'text-white' : 'text-gray-300'}`}>
              <p>{message.content}</p>
              <span className="text-xs text-gray-400">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom section: Input message */}
      <div className="flex items-center mt-auto">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 rounded-full py-2 px-4 focus:outline-none"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button
          className="ml-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
