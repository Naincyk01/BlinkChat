// src/components/GroupSettingsPopup.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance.jsx';
import { IoClose } from "react-icons/io5";


const GroupSettingsPopup = ({ group, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [newGroupName, setNewGroupName] = useState(group.name || '');
  const [newParticipant, setNewParticipant] = useState('');

  useEffect(() => {
    setParticipants(group.participants);
  }, [group]);

  const handleUpdateGroupName = async () => {
    try {
      await axios.put(`/groups/${group._id}`, { name: newGroupName });
      alert('Group name updated!');
    } catch (error) {
      console.error('Error updating group name:', error);
    }
  };

  const handleAddParticipant = async () => {
    try {
      await axios.post(`/groups/${group._id}/participants`, { userId: newParticipant });
      alert('Participant added!');
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.delete(`/groups/${group._id}/leave`);
      alert('You left the group!');
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white rounded-lg p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          <IoClose/>
        </button>
        <h3 className="text-xl font-semibold mb-4">Group Settings</h3>
        <div className="mb-4">
          <h4 className="text-lg font-medium mb-2">Participants</h4>
          {participants.map(participant => (
            <div key={participant._id} className="flex items-center mb-2">
              <span className="flex-1">{participant.name}</span>
              <button className="text-red-500">Remove</button>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Update group name"
            className="border p-2 rounded w-full"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <button onClick={handleUpdateGroupName} className="bg-blue-500 text-white p-2 rounded mt-2 w-full">
            Update
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Add participant"
            className="border p-2 rounded w-full"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
          />
          <button onClick={handleAddParticipant} className="bg-green-500 text-white p-2 rounded mt-2 w-full">
            Add
          </button>
        </div>
        <button onClick={handleLeaveGroup} className="bg-red-500 text-white p-2 rounded w-full">
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupSettingsPopup;
