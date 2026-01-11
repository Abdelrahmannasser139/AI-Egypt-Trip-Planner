import { Navigate, useLocation } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation()
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Bypass authentication for testing
  return children;
}

export default ProtectedRoute
