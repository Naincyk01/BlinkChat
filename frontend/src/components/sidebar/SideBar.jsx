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
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [popupType, setPopupType] = useState(null); // `null`, `'user'`, or `'group'`

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/groups/findone');
      const userData = response.data.data;
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get('/groups/findgroup');
      const groupData = response.data.data;
      setGroups(groupData);
      setFilteredGroups(groupData);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleSearchChange = event => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(query);
    filterGroups(query);
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
    fetchUsers();
    closePopup();
  };

  const handleGroupCreated = () => {
    alert('Group created successfully!');
    fetchGroups();
    closePopup();
  };

  return (
    <div className="h-auto w-auto p-4 flex">
      <div className={isSidebarOpen ? '' : 'hidden'}>
        <SidebarContent />
      </div>
      <div className="w-[350px] h-full flex flex-col pl-5 gap-4">
        <div className='flex justify-end gap-x-2'>
          <IoMenu size={24} className="bg-[#0D0D0D] h-6 rounded-md border border-[#BCBEC0] border-opacity-50 cursor-pointer" onClick={toggleSidebar} />
          <IoMdPersonAdd size={24} className="bg-[#0D0D0D] h-6 w-6 rounded-full border border-[#BCBEC0] border-opacity-50 cursor-pointer" onClick={() => openPopup('user')} />
          <BsPeopleFill size={24} className="bg-[#0D0D0D] h-6 w-6 rounded-full border border-[#BCBEC0] border-opacity-50 cursor-pointer" onClick={() => openPopup('group')} />
        </div>
        <div className="w-full flex justify-center items-center ">
          <input
            type="text"
            className="w-full h-8 rounded-md px-4 border border-[#BCBEC0] focus:border-primaryDark focus:outline-none bg-[#0D0D0D] text-sm border-opacity-50"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className={`bg-[#0D0D0D] rounded-xl px-4 shadow-md border border-primaryLight border-opacity-50 h-[50%] overflow-y-auto ${filteredUsers.length > 0 ? 'scrollbar-hidden' : ''}`}>
          <div className="text-white font-semibold py-2">People</div>
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
        <div className={`bg-[#0D0D0D] rounded-xl px-4 shadow-md border border-primaryLight border-opacity-50 h-[50%] overflow-y-auto ${filteredGroups.length > 0 ? 'scrollbar-hidden' : ''}`}>
          <div className="text-white font-semibold py-2">Groups</div>
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
      </div>
      {popupType === 'user' && <UserSearchCreate onClose={closePopup} onChatCreated={handleChatCreated} />}
      {popupType === 'group' && <GroupSearchCreate onClose={closePopup} onGroupCreated={handleGroupCreated} />}
    </div>
  );
};

export default SideBar;
