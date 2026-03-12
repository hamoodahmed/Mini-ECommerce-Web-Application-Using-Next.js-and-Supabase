'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUser, FaEdit, FaHistory, FaBox, FaSignOutAlt } from 'react-icons/fa';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001'
  });

  // Mock order history data
  const orderHistory = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      total: 125.99,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-02-03',
      total: 89.50,
      status: 'Shipped',
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2024-02-20',
      total: 245.75,
      status: 'Processing',
      items: 5
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 mr-4"></div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={user.address}
                  onChange={(e) => setUser({...user, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center">
              <FaEdit className="mr-2" />
              Update Profile
            </button>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderHistory.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/account/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MiniShop
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 mr-4"></div>
                <div>
                  <h2 className="text-lg font-bold">{user.name}</h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>

              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition duration-300 ${
                        activeTab === 'profile'
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaUser className="mr-3" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition duration-300 ${
                        activeTab === 'orders'
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaHistory className="mr-3" />
                      Order History
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300">
                      <FaBox className="mr-3" />
                      My Addresses
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300">
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}