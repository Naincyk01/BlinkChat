import React, { useState } from 'react';
import axios from '../../axiosInstance.jsx'; 
import { IoClose } from 'react-icons/io5';

const UserSearchCreate = ({ onClose, onChatCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.post('/users/u/search', { searchTerm: query });
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleUserClick = async (user) => {
    try {
      const response = await axios.post('/groups/one', { participant:user.username});
      console.log(response.data.data)
        onChatCreated(); // Notify parent component about the successful creation
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={onClose}>

      <div className="text-white p-4 rounded-lg shadow-lg w-1/3 max-w-lg border border-gray-400 flex flex-col gap-4 bg-primaryLight"   onClick={(e) => e.stopPropagation()}> 

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Search Users</h2>
          <IoClose className="cursor-pointer" size={24} onClick={onClose} />
        </div>

        <input
          type="text"
          className="w-full h-8 text-gray-700 rounded-md px-4 border border-[#BCBEC0] focus:border-gray-900 focus:outline-none text-sm border-opacity-50"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map(user => (
              <div
                key={user._id}
                className="p-2 border-b border-[#BCBEC0] cursor-pointer hover:bg-[#CDE1FD]"
                onClick={() => handleUserClick(user)}
              >
                <p className="text-white">{user.username}</p>
                <p className="text-gray-600 text-sm">{user.fullName}</p>
              </div>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default UserSearchCreate;
