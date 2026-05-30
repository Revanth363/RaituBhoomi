// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { userProfile, isFarmer, isLabor, isAdmin } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            🌾 Raitu Bhoomi
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/archive" className="hover:text-green-200 transition">
              Knowledge Archive
            </Link>

            {isAuthenticated ? (
              <>
                {isFarmer && (
                  <Link to="/farmer/dashboard" className="hover:text-green-200 transition">
                    Dashboard
                  </Link>
                )}
                {isLabor && (
                  <Link to="/labor/dashboard" className="hover:text-green-200 transition">
                    Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin/moderation" className="hover:text-green-200 transition">
                    Moderation
                  </Link>
                )}

                <div className="flex items-center space-x-4 border-l border-green-600 pl-6">
                  <span className="text-sm">
                    {userProfile?.fullName} ({userProfile?.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded transition"
                    data-testid="logout-button"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded transition"
                  data-testid="login-link"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-700 hover:bg-green-100 px-4 py-2 rounded transition"
                  data-testid="register-link"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-3xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '×' : '☰'}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/archive"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-green-200 transition py-2"
              >
                Knowledge Archive
              </Link>

              {isAuthenticated ? (
                <>
                  {isFarmer && (
                    <Link
                      to="/farmer/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-green-200 transition py-2"
                    >
                      Dashboard
                    </Link>
                  )}
                  {isLabor && (
                    <Link
                      to="/labor/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-green-200 transition py-2"
                    >
                      Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/moderation"
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-green-200 transition py-2"
                    >
                      Moderation
                    </Link>
                  )}

                  <div className="border-t border-green-600 pt-4 mt-4">
                    <p className="text-sm mb-3">
                      {userProfile?.fullName} ({userProfile?.role})
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-green-600 hover:bg-green-800 px-4 py-2 rounded transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-green-600 hover:bg-green-800 px-4 py-2 rounded text-center transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white text-green-700 hover:bg-green-100 px-4 py-2 rounded text-center transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;