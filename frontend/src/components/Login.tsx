import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/user/login', { // Replace with your actual API URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message); // Success message
        

        // Save the token in localStorage
        localStorage.setItem('authToken', data.data); // Assuming 'data.data' contains the JWT token

        // You can also redirect the user to another page after successful login
        // window.location.href = '/dashboard'; // or use React Router to navigate
        navigate('/products-gallery');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong! Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex'>
      <div
        className="w-[50%] bg-[#3AB397] h-[100vh] text-white text-4xl font-bold flex justify-center items-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('emerald-background-design_23-2150319798 - Copy.jpg')" }}
      >
        Hey again !!
      </div>

      <div className="h-[100vh] flex flex-col justify-center items-center w-full md:w-[50%] bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col space-y-8"
        >
          <h1 className="text-3xl font-bold text-center text-[#018B70] mb-8">Login</h1>

          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {success && <div className="text-green-500 text-center mb-4">{success}</div>}

          <div className="flex flex-col space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="login-user-email"
              id="login-user-email"
              className="p-4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#017254] placeholder-gray-500"
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="login-user-pass"
              id="login-user-pass"
              className="p-4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#017254] placeholder-gray-500"
              placeholder="Password"
              required
            />
          </div>

          <div>
            <span className="flex justify-center">
              <button
                type="submit"
                className="bg-[#018369] text-white p-3 w-[50%] rounded-3xl hover:bg-[#014e3f] transition-colors"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </span>
          </div>

          <p className="text-center text-gray-600 mt-4">
            If you don't have an account yet,{' '}
            <button className="text-[#018369] cursor-pointer hover:underline" onClick={()=>navigate('/signup')}>Click Here</button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
