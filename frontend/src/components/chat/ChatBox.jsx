import React, { useState, useEffect, useRef } from 'react';
import axios from '../../axiosInstance.jsx';
import io from 'socket.io-client';
import SingleMessage from '../messageskeleton/SingleMessage.jsx';
import { CiMenuKebab } from 'react-icons/ci';
import GroupSetting from './GroupSetting.jsx';
import { FaEye } from 'react-icons/fa';
import { useChatContext } from '../../context/ChatContext.jsx';

const PopupMenu = ({ onDeleteGroup, isGroupChat }) => {
  return (
    <div className="absolute right-8 top-20 bg-primary border border-gray-600 rounded-lg shadow-lg z-10">
      <button
        onClick={onDeleteGroup}
        className="block px-4 py-2 text-white rounded-lg hover:bg-gray-700 w-full text-left"
      >
        {isGroupChat ? 'Delete Group' : 'Delete'}
      </button>
    </div>
  );
};

const ChatBox = ({ selectedUser, onChatDeleted }) => {
  const { refetchData } = useChatContext();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [fetchSelectedUser, setfetchSelectedUser] = useState(null);
  const socketRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isRefetched, setIsRefetched] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [userStatus, setUserStatus] = useState({});

  const fetchSelectedUserGroup = async () => {
    try {
      const response = await axios.get(`/groups/group/${selectedUser._id}`);
      const { data } = response.data;
      setfetchSelectedUser(data);
      setIsRefetched(true);
    } catch (error) {
      console.error('Error fetching selected user:', error);
    }
  };

  const fetchPreviousMessages = async () => {
    try {
      const response = await axios.get(`/messages/${selectedUser._id}`);
      const { data } = response.data;
      setMessages(data);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/users/');
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!selectedUser._id) return;
    fetchPreviousMessages();

    socketRef.current = io('https://blinkchat-8wly.onrender.com');
    socketRef.current.on('connect', () => {
      if (selectedUser._id) {
        socketRef.current.emit('joinRoom', { room: selectedUser._id });
      }
    });
    socketRef.current.on('message', message => {
      if (message.groupId === selectedUser._id) {
        setMessages(prevMessages => [...prevMessages, message]);
        refetchData();
      }
    });
    socketRef.current.on('statusUpdate', ({ socketId, status }) => {
      setUserStatus(prevStatus => ({
        ...prevStatus,
        [socketId]: status,
      }));
    });

    socketRef.current.on('currentStatuses', statuses => {
      const statusMap = {};
      statuses.forEach(({ socketId, status }) => {
        statusMap[socketId] = status;
      });
      setUserStatus(statusMap);
    });

    // Clean up socket connection
    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedUser._id]);

  useEffect(() => {
    // Reset fetchSelectedUser and isRefetched when selectedUser changes
    setfetchSelectedUser(null);
    setIsRefetched(false);
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
      refetchData();
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleInputChange = e => {
    setCurrentMessage(e.target.value);
  };

  const handlePopupToggle = () => {
    setShowPopup(prev => !prev);
  };

  const handleGroupSettingsToggle = () => {
    if (showGroupSettings) {
      fetchSelectedUserGroup();
      fetchPreviousMessages();
    } else {
      setIsRefetched(false);
    }
    setShowGroupSettings(prev => !prev);
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`/groups/${selectedUser._id}`); // API call to delete group
      onChatDeleted(); // Notify parent about deletion
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const isGroupChat = selectedUser.type === 'group';
  const headerTitle = isGroupChat
    ? isRefetched
      ? fetchSelectedUser?.name
      : selectedUser.name
    : isRefetched
      ? fetchSelectedUser?.fullName
      : selectedUser.fullName;

  const headerSubtitle = isGroupChat
    ? isRefetched
      ? `${fetchSelectedUser?.participants.length} members`
      : `${selectedUser.participants.length} members`
    : Object.values(userStatus).includes('online')
      ? 'Online'
      : 'Offline';

  return (
    <div className="w-full h-screen bg-chatBg p-4 flex">
      <div className="flex flex-col w-full h-full bg-[#0D0D0D] border border-primaryLight border-opacity-50 rounded-xl gap-2">
        {/* Top section: Receiver's info */}

        <div className="flex justify-between border-b border-gray-600 p-4">
          <div className="flex w-40 h-14 gap-x-4">
            <div className="border h-14 w-14 rounded-full">
              <img
                src={isGroupChat ? '' : selectedUser.profilepic}
                className="h-full w-full rounded-full bg-gray-800"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-white">{headerTitle}</h3>
              <p className="text-sm text-gray-400">{headerSubtitle}</p>
            </div>
          </div>

          <div className="flex justify-center gap-x-3">
            {isGroupChat && (
              <button onClick={handleGroupSettingsToggle} className="text-gray-400">
                <FaEye />
              </button>
            )}
            <button onClick={handlePopupToggle} className="text-gray-400">
              <CiMenuKebab />
            </button>
            {showPopup && <PopupMenu onDeleteGroup={handleDeleteGroup} isGroupChat={isGroupChat} />}
            {showGroupSettings && (
              <GroupSetting group={selectedUser} onClose={handleGroupSettingsToggle} />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-3 p-4 scrollbar-hidden">
          {messages.map(message => {
            return (
              <SingleMessage
                key={message._id}
                message={message}
                isOwnMessage={message.sender._id === currentUser._id}
              />
            );
          })}
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
