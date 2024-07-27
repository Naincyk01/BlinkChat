// UserSearchPopup.jsx
import React, { useState } from 'react';
import axios from '../../axiosInstance.jsx'; // Adjust the import path as necessary
import { IoClose } from 'react-icons/io5';

const UserSearchCreate = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.post('/users/u/search', { searchTerm: query });
        setSearchResults(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="  bg-white text-black p-4 rounded-lg shadow-lg w-1/3 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search Users</h2>
          <IoClose className="cursor-pointer" size={24} onClick={onClose} />
        </div>
        <input
          type="text"
          className="w-full h-8 rounded-md px-4 border border-[#BCBEC0] focus:border-primaryDark focus:outline-none text-sm border-opacity-50"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="mt-4 max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map(user => (
              <div key={user._id} className="p-2 border-b border-[#BCBEC0] bg-green-800">
                <p className="text-white">{user.username}</p>
                <p className="text-gray-400 text-sm">{user.fullName}</p>
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
