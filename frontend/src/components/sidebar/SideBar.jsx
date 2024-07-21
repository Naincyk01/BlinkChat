import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RegisteredUserDisplay from '../messageskeleton/RegisteredUserDisplay.jsx';

const SideBar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users/all');
        setUsers(response.data);
        console.log(response.data) //Assuming your response structure has a 'data' array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);//Store the error message
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="h-auto w-auto p-4 flex">
      {/* Side Bar */}
      <div className="bg-primary flex flex-col justify-between items-center w-[162px] rounded-lg p-4 gap-10">
        {/* Photo */}
        <div className="border h-20 rounded-full w-20"></div>

        {/* Icons */}
        <div className="flex flex-col gap-8">
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Home</div>
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Notification</div>
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Message</div>
          </div>
          <div className="p-3 rounded-lg flex justify-center items-center">
            <div>Setting</div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center items-center p-3 rounded-lg mb-4">
          <div>Logout Button</div>
        </div>
      </div>

      {/* Search and Chat User */}
      <div className="w-[350px] h-full flex flex-col pl-6 gap-6">
        <div className="w-full">
          {/* Search Input */}
          <input type="text" className="w-full h-10 rounded-xl px-4 text-black border border-[#BCBEC0] focus:border-primaryDark focus:outline-none bg-[#0D0D0D] text-sm" placeholder="Search users..."/>
        </div>

        <div className="bg-[#0D0D0D] rounded-md pl-4 shadow-md border h-auto overflow-y-auto">
          <div className="text-white font-semibold px-4 py-2">People</div>
          <div className="flex flex-col gap-2">
            {/* {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {users.map(user => (
              <RegisteredUserDisplay key={user._id} user={user} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
