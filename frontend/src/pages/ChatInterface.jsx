// ChatInterface.jsx

import React, { useState , useCallback } from 'react';
import Sidebar from "../components/sidebar/SideBar.jsx";
import WorkArea from "../components/chat/WorkArea.jsx";
import ChatBox from "../components/chat/ChatBox.jsx";
import { useChatContext } from '../context/ChatContext.jsx';

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { refetchData } = useChatContext();

  const handleUserClick = (entity) => {
    setSelectedUser(entity);
  };

  const handleChatDeleted = () => {
    setSelectedUser(null); // Clear selectedUser to show WorkArea
    refetchData(); // Refetch data
  };

  return (
    <div className='w-full h-screen flex bg-chatBg text-white'>
      <Sidebar onUserClick={handleUserClick} />
      {selectedUser ? (
        <ChatBox selectedUser={selectedUser} onChatDeleted={handleChatDeleted} />
      ) : (
        <WorkArea />
      )}
    </div>
  );
};

export default ChatInterface;
