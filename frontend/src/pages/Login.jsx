import React from 'react';
import loginBackground from '../assets/bglogin.png';
import {buttonHoverAnimaiton} from '../utils/TailwindUtlis.jsx'
import { Link } from 'react-router-dom';


const Login = () => {
  const inputContainerStyles ="flex flex-col gap-2 w-full";
  const inputStyles = "w-full h-8 rounded-md px-4 text-black text-sm border-2 border-[#BCBEC0] focus:border-primaryDark focus:outline-none";

  
  return (
    <div
      className="flex justify-center items-center w-full h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="bg-gray-400 rounded-3xl w-[450px] h-auto flex flex-col justify-center items-center shadow-md bg-clip-padding backdrop-filter backdrop-blur-lg gap-10 p-6 px-rootXPadd bg-opacity-0 border border-primary">
        <button className="font-bold mr-4 drop-shadow-lg text-logoFontSize">
          <span className="">
            Blink<span className="text-primary">Chat</span>
          </span>
        </button>

        <div className='flex flex-col w-full gap-6'>

          <div className='text-2xl font-bold text-white'>Login to your account</div>

          <form className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3 items-start w-full'>
            <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Email</label>
                <input
                  type="text"
                  placeholder="username@gmail.com"
                  className={`${inputStyles}`}
                />
              </div>
            <div className={`${inputContainerStyles}`}>
                <label className="capitalize">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className={`${inputStyles}`}
                />
              </div>
              <button className='capitalize'>Forgot Password?</button>
            </div>
            <button className={`flex justify-center items-center text-lg font-bold bg-primary py-2 rounded-lg ${buttonHoverAnimaiton} hover:-translate-y-2 hover:bg-primaryDark`}>
              Login
            </button>
          </form>
          <span className="text-xs text-center font-light">
            Don't Have An Account yet? <Link to='signin' className="font-bold">Sign Up</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
