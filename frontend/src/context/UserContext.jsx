import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      setUserProfile(user);
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const updateProfile = (updates) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updates }));
  };

  const value = {
    userProfile,
    updateProfile,
    isFarmer: userProfile?.role === 'farmer',
    isLabor: userProfile?.role === 'labor',
    isAdmin: userProfile?.role === 'admin',
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
