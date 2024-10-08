import React, { useState } from 'react';
import loginBackground from '../assets/bglogin.png';
import axios from "../axiosInstance.jsx";
import { buttonHoverAnimaiton } from '../utils/TailwindUtlis.jsx';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    bio: '',
    profilepic: null  // New state for profile picture
  });

  const inputContainerStyles = "flex flex-col gap-2 w-full";
  const inputStyles = "w-full h-8 rounded-md px-4 text-black text-sm border-2 border-[#BCBEC0] focus:border-primaryDark focus:outline-none";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      profilepic: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataWithFile = new FormData();
      formDataWithFile.append('fullName', formData.fullName);
      formDataWithFile.append('username', formData.username);
      formDataWithFile.append('email', formData.email);
      formDataWithFile.append('password', formData.password);
      formDataWithFile.append('bio', formData.bio);
      formDataWithFile.append('profilepic', formData.profilepic);

      const response = await axios.post('/users/register', formDataWithFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div
      className="flex justify-center items-center w-full h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="bg-gray-400 rounded-3xl w-[450px] h-auto flex flex-col justify-center items-center shadow-md bg-clip-padding backdrop-filter backdrop-blur-lg gap-3 p-4 px-rootXPadd bg-opacity-0 border border-primary">
        <button className="font-bold mr-4 drop-shadow-lg text-logoFontSize">
          <span className="">
            Blink<span className="text-primary">Chat</span>
          </span>
        </button>

        <div className='flex flex-col gap-4 w-full'>
          <div className='text-2xl font-bold text-white'>Register</div>

          <form className='flex flex-col gap-5' onSubmit={handleSubmit} encType="multipart/form-data">
            <div className='flex flex-col gap-3 items-start w-full'>
              <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Full Name</label>
                <input
                  type="text"
                  placeholder="Harry Seth"
                  className={`${inputStyles}`}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Username</label>
                <input
                  type="text"
                  placeholder="harry123"
                  className={`${inputStyles}`}
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Email</label>
                <input
                  type="text"
                  placeholder="username@gmail.com"
                  className={`${inputStyles}`}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Password</label>
                <input
                  type="password"
                  placeholder="password"
                  className={`${inputStyles}`}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Bio</label>
                <input
                  type="text"
                  placeholder="bio"
                  className={`${inputStyles}`}
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  className={`${inputStyles} text-white bg-primary border-opacity-50 border-primaryDark`}
                  name="profilepic"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <button type="submit" className={`flex justify-center items-center text-lg font-bold bg-primary py-2 rounded-lg ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark`}>
              Sign up
            </button>
          </form>
          <span className="text-xs text-center font-light">
            Already have an account? <Link to='/' className="font-bold">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
