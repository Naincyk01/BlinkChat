import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance.jsx';
import io from 'socket.io-client';

const UserToChatDisplay = ({ user, onClick }) => {
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
      if (message.groupId === user._id) {
        // Update the latest message
        setLatestMessage(message);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user._id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const content = latestMessage?.content || 'No message available';
  const createdAt = latestMessage?.createdAt;

  const formatTimestamp = timestamp => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

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
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="text-xs text-gray-500 flex">
          {user.bio}
        </div>
        <div className='text-xs text-gray-500 flex justify-end'>
          {formatTimestamp(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default UserToChatDisplay;
