import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance.jsx';
import io from 'socket.io-client';

const UserToChatDisplay = ({ user, onClick,isGroup }) => {
  const [latestMessage, setLatestMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const latestMessageId = user.latestMessage;

  useEffect(() => {
    const fetchLatestMessage = async () => {
      if (!latestMessageId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/messages/message/${latestMessageId}`);
        setLatestMessage(response.data.data || {});
      } catch (err) {
        setError('Error fetching message');
        console.error('Error fetching latest message:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestMessage();
  }, [latestMessageId]);

  useEffect(() => {
    const socket = io('http://localhost:9000');

    socket.on('connect', () => {
  
      if (user._id) {
        socket.emit('joinRoom', user._id);
      }
    });

    socket.on('message', (message) => {
      if ((message.groupId === user._id) ) {
        // Update the latest message
        setLatestMessage(message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user._id]);

  const truncateMessage = (message, maxLength) => {
    if (!message || message.length <= maxLength) {
      return message;
    }
    return `${message.substring(0, maxLength)}...`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);

    // Manual formatting
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // '0' should be '12' for midnight
    
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const content = latestMessage?.content || 'No message available';
  const createdAt = latestMessage?.createdAt;
  const truncatedContent = truncateMessage(content, 10); // Adjust 10 to desired length

  return (
    <div
      className="flex items-center justify-between h-full w-full py-2 mb-1 border-b border-[#C4C4C4] border-opacity-50"
      onClick={onClick}
    >
      <div className='flex gap-x-3'>
        <div className="border h-14 rounded-full w-14 flex justify-center items-center">
          <img src={isGroup ?"": user.profilepic} className="h-full w-full rounded-full" alt="picture" />
        </div>
        <div className="flex flex-col">
        <h3 className="text-lg font-semibold">
            {isGroup ? user.name : user.fullName}
          </h3>
          <p className="text-sm text-gray-500">{truncatedContent}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className='text-xs text-gray-500 flex justify-end'>
          {formatTimestamp(createdAt)}
        </div>
        <div className="text-xs text-gray-500 flex justify-end">
          ✅
        </div>
      </div>
    </div>
  );
};

export default UserToChatDisplay;

