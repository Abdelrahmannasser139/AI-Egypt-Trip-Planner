// Mock authentication service for development
import { jwtDecode } from 'jwt-decode';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'password123',
    role: 'user',
    profileImage: null,
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    profileImage: null,
  },
];

// Generate a mock JWT token
const generateMockToken = (user) => {
  // Create a simple mock token with user data and expiration
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60 * 24; // 24 hours
  
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: now,
    exp: now + expiresIn,
  };
  
  // In a real app, this would be signed with a secret key
  // Here we just encode it to base64
  return btoa(JSON.stringify(payload));
};

// Mock login function
export const mockLogin = async (email, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user by email
  const user = mockUsers.find(user => user.email === email);
  
  // Check if user exists and password matches
  if (!user || user.password !== password) {
    throw {
      response: {
        data: {
          error: 'Invalid credentials',
        },
      },
    };
  }
  
  // Generate token
  const token = generateMockToken(user);
  
  // Return user data and token
  return {
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    },
  };
};

// Mock register function
export const mockRegister = async (userData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email already exists
  const existingUser = mockUsers.find(user => user.email === userData.email);
  if (existingUser) {
    throw {
      response: {
        data: {
          error: 'Email already in use',
        },
      },
    };
  }
  
  // Create new user
  const newUser = {
    id: String(mockUsers.length + 1),
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: 'user',
    profileImage: null,
  };
  
  // Add to mock users array
  mockUsers.push(newUser);
  
  // Generate token
  const token = generateMockToken(newUser);
  
  // Return user data and token
  return {
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
      token,
    },
  };
};

// Mock social login function
export const mockSocialLogin = async (provider, token) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create a mock social user based on the provider
  const socialUser = {
    id: String(mockUsers.length + 1),
    name: provider === 'google' ? 'Google User' : 'Facebook User',
    email: provider === 'google' ? 'google.user@example.com' : 'facebook.user@example.com',
    role: 'user',
    profileImage: null,
  };
  
  // Generate token
  const authToken = generateMockToken(socialUser);
  
  // Return user data and token
  return {
    data: {
      user: {
        id: socialUser.id,
        name: socialUser.name,
        email: socialUser.email,
        role: socialUser.role,
        profileImage: socialUser.profileImage,
      },
      token: authToken,
    },
  };
};

// Mock update profile function
export const mockUpdateProfile = async (userData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return updated user data
  return {
    data: userData,
  };
};

// Helper function to decode JWT token
export const decodeMockToken = (token) => {
  try {
    // In a real app, this would verify the signature
    // Here we just decode the base64
    return JSON.parse(atob(token));
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
