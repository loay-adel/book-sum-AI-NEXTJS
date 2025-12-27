// app/admin/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
// In your page.jsx or admin login component
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    console.log('Attempting admin login...');
    
    const response = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // CRITICAL: Send cookies
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login failed:', errorText);
      throw new Error('Login failed. Please check your credentials.');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    
    // Set authentication flags
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('admin_username', username);
    
    // Small delay to ensure cookies are set
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify session
    const verifyResponse = await fetch(`${API_BASE}/api/admin/verify-token`, {
      method: 'GET',
      credentials: 'include'
    });
    
    if (!verifyResponse.ok) {
      throw new Error('Session verification failed');
    }
    
    console.log('Session verified, redirecting...');
    window.location.href = '/admin/dashboard';
    
  } catch (error) {
    console.error('Login error:', error);
    setError(error.message);
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Admin Login
          </h1>
          <p className="text-gray-400">Secure Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 text-red-300 p-3 rounded-lg text-center border border-red-800/50">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-1">Please check your credentials and try again.</p>
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="text-center text-sm text-gray-400">
            <p>For security reasons, please use the admin credentials provided to you.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;