import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance.jsx';
import UserToChatDisplay from '../messageskeleton/UserToChatDisplay.jsx';
import { IoHomeOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { GrLogout } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import Profile from '../../assets/bglogin.png';

const SideBar = ({ onUserClick }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/groups/');
        console.log(response.data);
        setUsers(response.data.data);
        setFilteredUsers(response.data.data); // Initialize filteredUsers with all users
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(query);
  };

  // Function to filter users based on search query
  const filterUsers = (query) => {
    if (!query) {
      setFilteredUsers(users); // If query is empty, show all users
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <div className="h-auto w-auto p-4 flex">
      {/* Side Bar */}
      <div className="bg-primary flex flex-col justify-between items-center w-[162px] rounded-lg p-4 gap-10">
        {/* Photo */}
        <img src={Profile} alt="User Avatar" className="border h-20 rounded-full w-20" />

        {/* Icons */}
        <div className="flex flex-col gap-5">
          <div className="p-3 rounded-lg flex justify-center items-center">
            <IoHomeOutline size={38} />
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <IoMdNotificationsOutline size={40} />
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <AiOutlineMessage size={35} />
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <IoSettingsOutline size={35} />
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center items-center p-3 rounded-lg mb-2">
          <GrLogout size={38} />
        </div>
      </div>

      {/* Search and Chat User */}
      <div className="w-[350px] h-full flex flex-col pl-6 gap-6">
        <div className="w-full">
          {/* Search Input */}
          <input
            type="text"
            className="w-full h-10 rounded-xl px-4 border border-[#BCBEC0] focus:border-primaryDark focus:outline-none bg-[#0D0D0D] text-sm border-opacity-50"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className={`bg-[#0D0D0D] rounded-md pl-4 pr-4 shadow-md border border-primaryLight border-opacity-50 h-auto overflow-y-auto ${filteredUsers.length > 0 ? 'scrollbar-hidden' : ''}`}>
          <div className="text-white font-semibold px-4 py-2">People</div>
          <div className="flex flex-col gap-2">
            {error && <p>Error: {error}</p>}
            {filteredUsers.map(user => (
              <UserToChatDisplay key={user._id} user={user}  onClick={() => onUserClick(user)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;



