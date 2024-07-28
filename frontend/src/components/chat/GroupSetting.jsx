// src/components/GroupSettingsPopup.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance.jsx';
import { IoClose } from "react-icons/io5";

const GroupSettingsPopup = ({ group, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [newGroupName, setNewGroupName] = useState(group.name || '');
  const [newParticipant, setNewParticipant] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Fetch participants
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`/groups/${group._id}/participants`);
        setParticipants(response.data.data);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [group]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      // Search users
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(`/users/u/search/searchUsers?query=${searchQuery}`);
          setSearchResults(response.data.data);
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleUpdateGroupName = async () => {
    try {
      await axios.put(`/groups/${group._id}`, { name: newGroupName });
      alert('Group name updated!');
    } catch (error) {
      console.error('Error updating group name:', error);
    }
  };

  const handleAddParticipant = async (userId) => {
    try {
      await axios.post(`/groups/${group._id}/participants`, { userId });
      setNewParticipant(''); // Clear the input field
      setSearchQuery(''); // Clear search query
      // Re-fetch participants after adding a new one
      const response = await axios.get(`/groups/${group._id}/participants`);
      setParticipants(response.data.data);
      alert('Participant added!');
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      // Remove participant from the server
      await axios.delete(`/groups/${group._id}/participants/${userId}`);
      // Remove participant from local state
      setParticipants(participants.filter(participant => participant._id !== userId));
      alert('Participant removed!');
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.delete(`/groups/${group._id}/leave`);
      alert('You left the group!');
      onClose(); // Close the popup on leaving the group
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-primary rounded-lg p-6 relative">

        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          <IoClose />
        </button>
        <h3 className="text-xl font-semibold mb-4">Group Settings</h3>
        
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Participants</h4>
          <div className="flex overflow-x-auto space-x-4 p-2">
            {participants.map(participant => (
              <div
                key={participant._id}
                className="flex items-center border-r border-gray-300 pr-4 last:border-r-0"
              >
                <span>{participant.fullName}</span>
                <button className="text-red-500 ml-2" onClick={() => handleRemoveParticipant(participant._id)}>
                  &#10005; {/* Cross icon */}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Update group name"
            className="border p-2 rounded-l w-full text-gray-700"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button
            onClick={handleUpdateGroupName}
            className="bg-green-500 text-white p-2 rounded-r ml-2"
          >
            Update
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search users"
            className="border p-2 rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="border border-gray-300 rounded mt-2 bg-white">
              {searchResults.map(user => (
                <div key={user._id} className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleAddParticipant(user._id)}>
                  <span>{user.fullName}</span>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleLeaveGroup} className="bg-red-500 text-white p-2 rounded w-full">
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupSettingsPopup;
