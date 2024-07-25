import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance.jsx';
import { useNavigate } from 'react-router-dom'; 
import UserToChatDisplay from '../messageskeleton/UserToChatDisplay.jsx';
import { IoHomeOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { GrLogout } from 'react-icons/gr';
import { IoSettingsOutline, IoMenu } from 'react-icons/io5'; 
import Profile from '../../assets/bglogin.png';

const SideBar = ({ onUserClick }) => {
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [profilePic, setProfilePic] = useState(Profile); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/groups/findone');
        const groupData = response.data.data;
        console.log(groupData)
        setUsers(groupData);
        setFilteredUsers(groupData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/users/');
        const user = response.data.data;
        setCurrentUser(user);
        if (user.profilepic) {
          setProfilePic(user.profilepic); // Update profile picture state if available
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(query);
  };

  const filterUsers = (query) => {
    if (!query) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/users/logout'); // Logout API call

      setCurrentUser(null); // Clear current user state
      setProfilePic(Profile); // Reset profile picture to default
      
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); 
  };
// console.log(currentUser);
  return (
    <div className="h-auto w-auto p-4 flex">
      <div
        className={`bg-primary flex flex-col justify-between items-center w-[162px] rounded-lg p-4 gap-10 ${
          isSidebarOpen ? '' : 'hidden'
        }`}
      >
        <img
          src={profilePic}
          // src={Profile}
          alt="User Avatar"
          className="border h-20 rounded-full w-20"
        />

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

        <div
          className="flex justify-center items-center p-3 rounded-lg mb-2 cursor-pointer"
          onClick={handleLogout}
        >
          <GrLogout size={38} />
        </div>
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
          className={`bg-[#0D0D0D] rounded-md pl-4 pr-4 shadow-md border border-primaryLight border-opacity-50 h-auto overflow-y-auto ${
            filteredUsers.length > 0 ? 'scrollbar-hidden' : ''
          }`}
        >
          <div className="text-white font-semibold px-4 py-2">People</div>
          <div className="flex flex-col gap-2">
            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserToChatDisplay
                  key={user._id}
                  user={user}
                  onClick={() => onUserClick(user)}
                />
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
