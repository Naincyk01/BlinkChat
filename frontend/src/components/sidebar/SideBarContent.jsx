// SidebarContent.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoHomeOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { GrLogout } from 'react-icons/gr';
import { IoSettingsOutline } from 'react-icons/io5';
import axios from '../../axiosInstance.jsx';
import Profile from '../../assets/bglogin.png';
import UserProfileModal from './UserProfileModal.jsx'; 

const SidebarContent = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(Profile);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/users/');
        const user = response.data.data;
        if (user.profilepic) {
          setProfilePic(user.profilepic);
        }
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/users/logout');
      localStorage.setItem('accessToken', '')
      localStorage.setItem('refreshToken', '')
      setCurrentUser(null);
      setProfilePic(Profile);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfilePicClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-primary h-full flex flex-col justify-between items-center w-[162px] rounded-lg p-4 gap-10">
      <img
        src={profilePic}
        alt="User Avatar"
        className="border h-20 rounded-full w-20 flex justify-center items-center cursor-pointer"
        onClick={handleProfilePicClick}
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

      {isModalOpen && currentUser && (
        <UserProfileModal user={currentUser} onClose={closeModal} />
      )}
    </div>
  );
};

export default SidebarContent;
