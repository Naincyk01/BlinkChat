// UserProfileModal.jsx
import React from 'react';
import { MdOutlineClose } from 'react-icons/md';

const UserProfileModal = ({ user, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close the modal when clicking outside
    >
      <div
        className="bg-primaryLight border-2 p-8 rounded-lg shadow-lg max-w-md w-full h-auto max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="flex justify-between items-center">
          {/* <h2 className="text-2xl font-bold flex justify-center">User Profile</h2> */}
          <button onClick={onClose} className="border-2 rounded-sm">
            <MdOutlineClose size={15} />
          </button>
        </div>
        <div className="flex justify-center mb-6">
          <img
            src={user.profilepic}
            alt="User Avatar"
            className="border h-32 rounded-full w-32"
          />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Name: {user.fullName}</p>
          <p className="text-md">Email: {user.email}</p>
          <p className="text-md">Bio: {user.bio}</p>
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;
