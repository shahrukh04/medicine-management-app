import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F3F9] via-[#D1E8F5] to-[#B8DCEF] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#A4C9E5]/20">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="mx-auto h-20 w-20 bg-gradient-to-tr from-[#2B6CB0] to-[#4299E1] rounded-full flex items-center justify-center mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="mt-6 text-4xl font-extrabold text-[#2D3748] tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-lg text-[#4A5568]">
              Sign in to your account
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-[#2D3748] text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-[#CBD5E0] rounded-xl placeholder-[#A0AEC0] text-[#2D3748] focus:border-[#4299E1] focus:ring-2 focus:ring-[#4299E1]/20 transition duration-200 outline-none"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-[#2D3748] text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-[#CBD5E0] rounded-xl placeholder-[#A0AEC0] text-[#2D3748] focus:border-[#4299E1] focus:ring-2 focus:ring-[#4299E1]/20 transition duration-200 outline-none"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#4299E1] focus:ring-[#4299E1] border-[#CBD5E0] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#4A5568]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#4299E1] hover:text-[#2B6CB0] transition duration-150 ease-in-out">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#4299E1] hover:bg-[#2B6CB0] text-white rounded-xl py-4 font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E2E8F0]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#718096]">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="w-full block text-center py-4 border-2 border-[#E2E8F0] rounded-xl text-[#4A5568] font-medium hover:bg-[#F7FAFC] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
