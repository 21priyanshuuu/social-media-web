'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  socialHandle: string;
  images: string[];
  createdAt: string;
}

export default function AdminPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  const [users, setUsers] = useState<User[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);

  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch registered users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Check if user is already registered as admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.email) {
        return; // Don't proceed if email is not available
      }
    
      try {
        const response = await axios.get('/api/admin/check-registration', {
          params: { email: session.user.email }, // Pass the email as a query parameter
        });
    
        if (response.status === 200) {
          setIsRegistered(true);
          setAdminData(response.data); // Assuming this returns admin-specific data
        }
      } catch (error) {
        console.error('Error checking admin registration:', error);
      }
    };
    

    checkAdminStatus();
  }, []);

  // Handle admin registration form submission
  const handleAdminRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/admin/add', { email, secretKey });

      if (response.status === 200) {
        setMessage('Admin registration successful!');
        setEmail('');
        setSecretKey('');
        setIsRegistered(true);
        setAdminData(response.data); // Assuming the response includes admin-specific data
      } else {
        setMessage(response.data.error || 'Failed to register as admin');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null; // Prevent rendering until session is loaded
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {isRegistered ? (
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Welcome, Admin!
            </h2>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Registered Users</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                      <h2 className="text-xl font-semibold">{user.name}</h2>
                      <p className="text-gray-500">@{user.socialHandle}</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {user.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Upload by ${user.name}`}
                          className="w-full h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Register as Admin
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleAdminRegistration}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Admin Secret Key"
                  />
                </div>
              </div>
              {message && (
                <div
                  className={`text-center mt-4 ${
                    message.includes('success') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {message}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {loading ? 'Processing...' : 'Register'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
