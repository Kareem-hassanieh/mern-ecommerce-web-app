import React from 'react'

import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  return (
    <div className='flex'>
     <div className="w-[50%] bg-[#3AB397] h-[100vh] text-white  text-4xl font-bold   flex justify-center items-center text-center bg-cover bg-center" style={{ backgroundImage: "url('emerald-background-design_23-2150319798 - Copy.jpg')" }}>
     Welcome to Our Store!
</div>


<div className="h-[100vh] flex flex-col justify-center items-center w-full md:w-[50%] bg-gray-100">
  <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col space-y-8">
  <h1 className="text-3xl font-bold text-center text-[#018B70] mb-8">Create Your Account</h1>


    <div className="flex flex-col space-y-4">

    <input
        type="text"
        name="login-user-name"
        id="login-user-name"
        className="p-4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#017254] placeholder-gray-500"
        placeholder="name"
      />



      <input
        type="text"
        name="login-user-email"
        id="login-user-email"
        className="p-4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#017254] placeholder-gray-500"
        placeholder="Email"
      />
      <input
        type="password"
        name="login-user-pass"
        id="login-user-pass"
        className="p-4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#017254] placeholder-gray-500"
        placeholder="Password"
      />
    </div>

    <div>
      <span className="flex justify-center">
      <button className="bg-[#018369] text-white p-3 w-[50%] rounded-3xl hover:bg-[#014e3f] transition-colors">
        Sign up
      </button>

      </span>
     
    </div>

    <p className="text-center text-gray-600 mt-4">
      If you  have an account ,{' '}
      <span className="text-[#018369] cursor-pointer hover:underline" onClick={()=>navigate('/')}>Click Here</span>
    </p>
  </form>
</div>

      </div>
  
     
  )
}

export default Signup