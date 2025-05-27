// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Date.now(),
      email,
      firstName: 'John',
      lastName: 'Doe',
      preferences: ['electronics', 'books'],
      browsingHistory: []
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now(),
      ...userData,
      preferences: [],
      browsingHistory: []
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
