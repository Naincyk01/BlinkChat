import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance.jsx';
import UserToChatDisplay from '../messageskeleton/UserToChatDisplay.jsx';
import { IoMenu } from 'react-icons/io5';
import SidebarContent from './SideBarContent.jsx';

const SideBar = ({ onUserClick }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/groups/findone');
        const groupData = response.data.data;
        console.log(groupData);
        setUsers(groupData);
        setFilteredUsers(groupData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = event => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(query);
  };

  const filterUsers = query => {
    if (!query) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="h-auto w-auto p-4 flex">
      <div
        className={`${isSidebarOpen ? '' : 'hidden'}`}>
        <SidebarContent />
      </div>
      <div className="w-[350px] h-full flex flex-col pl-6 gap-6">
        <div className="w-full flex justify-center items-center gap-x-2">
          <IoMenu
            size={30}
            className="bg-[#0D0D0D] h-8 rounded-md border border-[#BCBEC0] border-opacity-50 cursor-pointer"
            onClick={toggleSidebar}
          />
          <input
            type="text"
            className="w-full h-8 rounded-md px-4 border border-[#BCBEC0] focus:border-primaryDark focus:outline-none bg-[#0D0D0D] text-sm border-opacity-50"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div
          className={`bg-[#0D0D0D] rounded-md px-4 shadow-md border border-primaryLight border-opacity-50 h-auto overflow-y-auto ${
            filteredUsers.length > 0 ? 'scrollbar-hidden' : ''
          }`}
        >
          <div className="text-white font-semibold px-4 py-2">People</div>
          <div className="flex flex-col gap-2">
            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <UserToChatDisplay key={user._id} user={user} onClick={() => onUserClick(user)} />
              ))
            ) : (
              <p>No users found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
