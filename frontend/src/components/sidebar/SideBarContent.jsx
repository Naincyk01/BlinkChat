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

const SidebarContent = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(Profile);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/users/');
        const user = response.data.data;
        if (user.profilepic) {
          setProfilePic(user.profilepic);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/users/logout');
      setCurrentUser(null);
      setProfilePic(Profile);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="bg-primary h-full flex flex-col justify-between items-center w-[162px] rounded-lg p-4 gap-10">
      <img
        src={profilePic}
        alt="User Avatar"
        className="border h-20 rounded-full w-20 flex justify-center items-center"
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
  );
};

export default SidebarContent;
