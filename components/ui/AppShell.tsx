'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { FiMenu, FiX, FiHome, FiShoppingBag, FiShoppingCart, FiUser, FiLogOut, FiPackage, FiChevronDown, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    // Close mobile menu when navigating to new page
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Determine if current route is admin-related
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname === '/admin/login';

  // Define navigation items
  const publicNavItems = [
    { name: 'Home', href: '/', icon: FiHome },
    { name: 'Products', href: '/products', icon: FiShoppingBag },
    { name: 'Cart', href: '/cart', icon: FiShoppingCart },
    { name: 'About', href: '/about', icon: null },
    { name: 'Contact', href: '/contact', icon: null },
  ];

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: FiPackage },
    { name: 'Products', href: '/admin/products', icon: FiShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: FiPackage },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MiniShop</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-1">
              {publicNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 font-semibold border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user && user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* User Menu (Desktop) */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-base rounded-full bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors"
                  >
                    <FiUser className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">{user.email}</span>
                    <FiChevronDown className="h-5 w-5 text-gray-600" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <FiPackage className="inline mr-2 h-5 w-5" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <FiLogOut className="inline mr-2 h-5 w-5" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <FiUser className="h-5 w-5" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {publicNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {Icon && <Icon className="h-6 w-6" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user && user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="block px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiPackage className="inline mr-2 h-6 w-6" />
                  Admin
                </Link>
              )}

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <FiLogOut className="h-6 w-6" />
                  <span>Sign out</span>
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiUser className="h-6 w-6" />
                  <span>Sign in</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo and tagline */}
            <div className="col-span-2">
              <div className="flex items-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">MiniShop</span>
              </div>
              <p className="mt-4 text-gray-300 text-lg">
                Your one-stop destination for quality products with incredible discounts.
              </p>
              <div className="mt-6 inline-flex items-center px-5 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 text-lg font-bold rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Flat 25% discount on selected items
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-4">
                <li><Link href="/" className="block text-gray-300 hover:text-white transition-colors py-1">Home</Link></li>
                <li><Link href="/products" className="block text-gray-300 hover:text-white transition-colors py-1">Products</Link></li>
                <li><Link href="/about" className="block text-gray-300 hover:text-white transition-colors py-1">About Us</Link></li>
                <li><Link href="/contact" className="block text-gray-300 hover:text-white transition-colors py-1">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-white">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start text-gray-300">
                  <FiPhone className="mr-3 mt-1 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <FiMail className="mr-3 mt-1 flex-shrink-0" />
                  <span>info@minishop.com</span>
                </li>
                <li className="flex items-start text-gray-300">
                  <FiMapPin className="mr-3 mt-1 flex-shrink-0" />
                  <span>1234 Commerce St, Suite 100<br className="hidden md:block" /> City, State 12345</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-base">
              &copy; {new Date().getFullYear()} MiniShop. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap justify-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;