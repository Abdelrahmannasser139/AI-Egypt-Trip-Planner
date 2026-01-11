import { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { mockLogin, mockRegister, mockSocialLogin, mockUpdateProfile, decodeMockToken } from '../services/mock/mockAuthService'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      try {
        // For mock implementation, use our custom decoder
        // In production, this would use jwtDecode
        const decoded = decodeMockToken(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp > currentTime) {
          setCurrentUser(decoded)
          setIsAuthenticated(true)
          // Set authorization header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          // Token expired
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      // Use mock login service instead of real API
      const response = await mockLogin(email, password)
      const { token, user } = response.data

      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setCurrentUser(user)
      setIsAuthenticated(true)
      return user
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
      throw err
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      // Use mock register service instead of real API
      const response = await mockRegister(userData)
      const { token, user } = response.data

      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      setCurrentUser(user)
      setIsAuthenticated(true)
      return user
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const socialLogin = async (provider, token) => {
    try {
      setError(null)
      // Use mock social login service instead of real API
      const response = await mockSocialLogin(provider, token)
      const { token: authToken, user } = response.data

      localStorage.setItem('token', authToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

      setCurrentUser(user)
      setIsAuthenticated(true)
      return user
    } catch (err) {
      setError(err.response?.data?.error || `${provider} login failed`)
      throw err
    }
  }

  const updateProfile = async (userData) => {
    try {
      setError(null)
      // Use mock update profile service instead of real API
      const response = await mockUpdateProfile(userData)
      setCurrentUser({...currentUser, ...response.data})
      return response.data
    } catch (err) {
      setError(err.response?.data?.error || 'Profile update failed')
      throw err
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    socialLogin,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
