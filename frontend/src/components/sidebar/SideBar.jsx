
import React, { useState } from 'react';

const SideBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' },
    { id: 4, name: 'User 4' },
    { id: 5, name: 'User 5' },
  ]);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="h-auto w-auto p-4 flex border-2">


      {/* Side Blue */}
      <div className="bg-primary flex flex-col justify-between items-center w-[162px] rounded-lg p-4 gap-10">

        {/* Photo */}
        <div className='border h-20 rounded-full w-20'></div>

        {/* Icons */}
        <div className='flex flex-col gap-8'>

          <div className='p-3 rounded-lg flex justify-center items-center'>
            <div>Home</div>
          </div>
          <div className='p-3 rounded-lg flex justify-center items-center'>
            <div>Notification</div>
          </div>
          <div className='p-3 rounded-lg flex justify-center items-center'>
            <div>Message</div>
          </div>
          <div className='p-3 rounded-lg flex justify-center items-center'>
            <div>Setting</div>
          </div>

        </div>

        {/* Logout Button */}
        <div className='flex justify-center items-center p-3 rounded-lg mb-4'>
          <div>Logout Button</div>
        </div>

      </div>

      {/* Search and Chat User */}
      <div className="w-[350px] h-full flex flex-col bg-red-100">
     
        <div className='pl-6'> {/* Search Input */}
        <input
          type="text"
          className="w-full p-2 rounded-xl mb-4 bg-[#0D0D0D] text-sm border border-[#BCBEC0] focus:border-primaryDark focus:outline-none"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        /></div>
       <div className="flex flex-col gap-2">
          {filteredUsers.map(user => (
            <div key={user.id} className="p-2 rounded-lg">
              {user.name}
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-gray-500">No users found.</div>
          )}
        </div>

        </div>
    </div>
  );
};

export default SideBar;
