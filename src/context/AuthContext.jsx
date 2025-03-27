import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login if credentials match
      if (email === 'user@example.com' && password === 'password123') {
        const userData = {
          id: '1',
          name: 'Demo User',
          email: email
        };
        setUser(userData);
        return userData;
      } else {
        // Check if user exists in localStorage (from previous signups)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          // Don't include password in the user state
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          return userWithoutPassword;
        } else {
          throw new Error('Invalid email or password');
        }
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll store the user in localStorage
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(user => user.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password // In a real app, this would be hashed
      };
      
      // Save to "database" (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Don't include password in the user state
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Context value
  const value = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};