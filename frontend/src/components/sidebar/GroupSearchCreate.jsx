import React, { useState } from 'react';
import axios from '../../axiosInstance.jsx'; 
import { IoClose } from 'react-icons/io5';
import { IoRemoveCircleOutline } from 'react-icons/io5';

const GroupSearchCreate = ({ onClose, onGroupCreated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState(''); 
  
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

  const handleUserClick = (user) => {
    if (!selectedUsers.some(selected => selected._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }

    const usernames = selectedUsers.map(user => user.username);

    try {
      const response = await axios.post('/groups/group', { 
        name: groupName,
        participants: usernames 
      });
      onGroupCreated();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-primaryLight text-white border border-gray-300 p-4 rounded-lg shadow-lg w-1/3 max-w-lg flex flex-col gap-5"  onClick={(e) => e.stopPropagation()}>

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Search Users to Create Group</h2>
          <IoClose className="cursor-pointer" size={24} onClick={onClose} />
        </div>
        <input
          type="text"
          className="w-full h-8 rounded-md px-4 border text-gray-700  border-[#BCBEC0] focus:border-gray-800 focus:outline-none text-sm border-opacity-50"
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
        <div className="text-white">
          {selectedUsers.length > 0 && (
            <>
              <h3 className="text-md font-semibold mb-2">Selected Users:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div
                    key={user._id}
                    className="flex items-center text-gray-700 p-2 border border-[#BCBEC0] rounded-md bg-gray-100"
                  >
                    <p className="mr-2">{user.username}</p>
                    <IoRemoveCircleOutline
                      className="text-red-500 cursor-pointer"
                      size={18}
                      onClick={() => handleRemoveUser(user._id)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="">
          <input
            type="text"
            className="w-full h-8 rounded-md px-4 border border-[#BCBEC0] focus:border-gray-800 text-gray-700 focus:outline-none text-sm border-opacity-50"
            placeholder="Group name..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        {selectedUsers.length > 0 && (
          <button
            onClick={handleCreateGroup}
            className="mt-4 bg-primaryDark text-white px-4 py-2 rounded-md hover:bg-primary"
          >
            Create Group
          </button>
        )}

      </div>
    </div>
  );
};

export default GroupSearchCreate;
