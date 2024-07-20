import React from 'react';

const RegisteredUserDisplay = () => {
  return (
    
      <div className="flex items-start py-4 border-b">
        <div className="border h-14 rounded-full w-14"></div>

        <div className="flex-1 flex flex-col">
          <div className="mb-1">
            <h3 className="text-lg font-semibold">Naincy</h3>
            <p className="text-sm text-gray-700">hello</p>
          </div>
        </div>

        <div className="mt-auto flex items-center flex-col">
          <div className="flex gap-x-1">
            <div className="text-xs text-gray-500">today</div>
            <div className="text-green-500 text-sm">5:26 P.m.</div>
          </div>
          <div>✅</div>
        </div>  
    </div>
  );
};

export default RegisteredUserDisplay;
