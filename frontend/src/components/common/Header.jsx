// src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">CivicTrack</div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/report" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/report') 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Report Issue
            </Link>
            <Link 
              to="/categories" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/categories') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Categories
            </Link>
            {user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Admin Panel
              </Link>
            )}
            
            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                <User size={18} />
                <span className="text-sm font-medium">{user.first_name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/report"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/report') 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Report Issue
              </Link>
              <Link 
                to="/categories"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/categories') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Categories
              </Link>
              {user.role === 'admin' && (
                <Link 
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/admin') 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
              <Link 
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;