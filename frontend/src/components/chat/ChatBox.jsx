import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axiosInstance.jsx';
import io from 'socket.io-client';
import SingleMessage from '../sidebar/SingleMessage.jsx'; 

const ChatBox = ({ selectedUser }) => {
  console.log(selectedUser)
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    // Function to fetch previous messages
    const fetchPreviousMessages = async () => {
      try {
        const response = await axios.get(`/messages/${selectedUser._id}`);
        const { data } = response.data;
        setMessages(data); // Update messages state with fetched messages
      } catch (error) {
        console.error('Error fetching previous messages:', error);
      }
    };

    // Fetch previous messages when selectedUser changes
    if (selectedUser._id) {
      fetchPreviousMessages();
    }

    // Socket connection setup
    socketRef.current = io('http://localhost:9000');
    socketRef.current.on('connect', () => {
      console.log('connected', socketRef.current.id);
      socketRef.current.emit('joinRoom', selectedUser._id);

      socketRef.current.on('message', message => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    });

    // Clean up socket connection
    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedUser._id]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return; // Do not send empty messages

    try {
      const response = await axios.post('/messages/', {
        groupId: selectedUser._id,
        content: currentMessage,
        type: 'text',
      });

      const newMessage = response.data.data;
      socketRef.current.emit('message', newMessage);
      setMessages([...messages, newMessage]);
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleInputChange = e => {
    setCurrentMessage(e.target.value);
  };

  return (
    <div className="w-full h-screen bg-chatBg p-4 flex">
      <div className="flex flex-col w-full h-full bg-[#0D0D0D] border border-primaryLight border-opacity-50 rounded-xl gap-2">
        {/* Top section: Receiver's info */}
        <div className="flex items-start pb-3 border-b border-gray-600 p-4">
          <div className="border h-14 rounded-full w-14 bg-gray-600"></div>
          <div className="flex flex-col pl-2">
            <h3 className="text-lg font-semibold text-white">{selectedUser.username}</h3>
            <p className="text-sm text-gray-400">online</p>
          </div>
        </div>

       
      
        <div className="flex-1 overflow-y-auto mb-3 p-4 scrollbar-hidden">
          {messages.map(message => (
            <SingleMessage
              key={message._id}
              message={message}
              isOwnMessage={message.sender.username === selectedUser.username} // Adjust the condition as per your data structure
            />
          ))}
        </div>

        {/* Bottom section: Input message */}
        <div className="flex items-center mt-auto p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 rounded-full py-2 px-4 focus:outline-none"
            value={currentMessage}
            onChange={handleInputChange}
          />
          <button
            onClick={sendMessage}
            className="ml-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
