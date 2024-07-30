import { useChatContext } from '../../context/ChatContext.jsx';
import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance.jsx';
import UserToChatDisplay from '../messageskeleton/UserToChatDisplay.jsx';
import { IoMenu } from 'react-icons/io5';
import SidebarContent from './SideBarContent.jsx';
import { IoMdPersonAdd } from 'react-icons/io';
import { BsPeopleFill } from 'react-icons/bs';
import UserSearchCreate from './UserSearchCreate.jsx';
import GroupSearchCreate from './GroupSearchCreate.jsx';

const SideBar = ({ onUserClick }) => {
  const { users, groups, refetchData } = useChatContext();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [popupType, setPopupType] = useState(null); // `null`, `'user'`, or `'group'`
  const [searchType, setSearchType] = useState('users'); // 'users' or 'groups'

  useEffect(() => {
    refetchData(); // Fetch data when component mounts or refetchData changes
  }, [refetchData]);

  useEffect(() => {
    if (searchType === 'users') {
      filterUsers(searchQuery);
    } else if (searchType === 'groups') {
      filterGroups(searchQuery);
    }
  }, [searchQuery, searchType, users, groups]);

   const handleSearchChange = event => {
    const query = event.target.value;
    setSearchQuery(query);
  };


  const filterUsers = query => {
    if (!query) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  };

  const filterGroups = query => {
    if (!query) {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter(group =>
        group.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredGroups(filtered);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openPopup = type => {
    setPopupType(type);
  };

  const closePopup = () => {
    setPopupType(null);
  };

  const handleChatCreated = () => {
    alert('Chat created successfully !');
    refetchData(); 
    closePopup();
  };

  const handleGroupCreated = () => {
    alert('Group created successfully!');
    refetchData(); 
    closePopup();
  };

  const handleSearchTypeChange = type => {
    setSearchType(type);
    setSearchQuery(''); // Clear search query when switching
    if (type === 'users') {
      filterUsers('');
    } else if (type === 'groups') {
      filterGroups('');
    }
  };

  return (
    <div className="h-auto w-auto p-4 flex">
      <div className={isSidebarOpen ? '' : 'hidden'}>
        <SidebarContent />
      </div>
      <div className="w-[350px] h-full flex flex-col pl-5 gap-4">
        <div className="w-full flex flex-col gap-y-2 justify-start">
          <input
            type="text"
            className="w-full h-8 rounded-md px-4 border border-[#BCBEC0] focus:border-primaryDark focus:outline-none bg-[#0D0D0D] text-sm border-opacity-50"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="flex justify-between">
            <div className='flex gap-x-2'>
              <button
                onClick={() => handleSearchTypeChange('users')}
                className={`px-4 text-sm py-1 rounded-xl ${searchType === 'users' ? 'bg-primary text-white' : 'bg-gray-200 text-primary'}`}
              >
                Users
              </button>
              <button
                onClick={() => handleSearchTypeChange('groups')}
                className={`px-4 py-1 text-sm rounded-xl ${searchType === 'groups' ? 'bg-primary text-white' : 'bg-gray-200 text-primary'}`}
              >
                Groups
              </button>
            </div>
            <div className="flex gap-x-2">
              <IoMenu
                size={24}
                className="bg-[#0D0D0D] h-6 rounded-md border border-[#BCBEC0] border-opacity-50 cursor-pointer"
                onClick={toggleSidebar}
              />
              <IoMdPersonAdd
                size={24}
                className="bg-[#0D0D0D] h-6 w-6 rounded-full border border-[#BCBEC0] border-opacity-50 cursor-pointer"
                onClick={() => openPopup('user')}
              />
              <BsPeopleFill
                size={24}
                className="bg-[#0D0D0D] h-6 w-6 rounded-full border border-[#BCBEC0] border-opacity-50 cursor-pointer"
                onClick={() => openPopup('group')}
              />
            </div>
          </div>
        </div>
        {searchType === 'users' && (
          <div
            className={`bg-[#0D0D0D] rounded-xl px-4 shadow-md h-full border border-primaryLight border-opacity-50  overflow-y-auto ${filteredUsers.length > 0 ? 'scrollbar-hidden' : ''}`}
          >
            <div className="flex flex-col gap-2 ">
              {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <UserToChatDisplay
                    key={user._id}
                    user={user}
                    onClick={() => onUserClick(user)}
                    isGroup={false}
                  />
                ))
              ) : (
                <p>No users found.</p>
              )}
            </div>
          </div>
        )}
        {searchType === 'groups' && (
          <div
            className={`bg-[#0D0D0D] rounded-xl px-4 shadow-md border h-full border-primaryLight border-opacity-50 overflow-y-auto ${filteredGroups.length > 0 ? 'scrollbar-hidden' : ''}`}
          >
            <div className="flex flex-col gap-2">
              {Array.isArray(filteredGroups) && filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <UserToChatDisplay
                    key={group._id}
                    user={group}
                    onClick={() => onUserClick(group)}
                    isGroup={true}
                  />
                ))
              ) : (
                <p>No groups found.</p>
              )}
            </div>
          </div>
        )}
      </div>
      {popupType === 'user' && (
        <UserSearchCreate onClose={closePopup} onChatCreated={handleChatCreated} />
      )}
      {popupType === 'group' && (
        <GroupSearchCreate onClose={closePopup} onGroupCreated={handleGroupCreated} />
      )}
    </div>
  );
};

export default SideBar;
