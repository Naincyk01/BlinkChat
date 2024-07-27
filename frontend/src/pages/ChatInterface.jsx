import React, { useState } from 'react';
import Sidebar from "../components/sidebar/SideBar.jsx";
import WorkArea from "../components/chat/WorkArea.jsx";
import ChatBox from "../components/chat/ChatBox.jsx";

const ChatInterface = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (entity) => {
    setSelectedUser(entity);
  };

  return (
    <div className='w-full h-screen flex bg-chatBg text-white'>
      <Sidebar onUserClick={handleUserClick} />
      {selectedUser ? (
        <ChatBox selectedUser={selectedUser} />
      ) : (
        <WorkArea />
      )}
    </div>
  );
};

export default ChatInterface;
