import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, socialLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get the redirect path from location state or default to home page
  const from = location.state?.from?.pathname || '/'
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in')
      setIsLoading(false)
    }
  }
  
  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)
    
    try {
      // In a real implementation, this would use the Google OAuth API
      console.log('Google login clicked')
      // Mock implementation for demo purposes
      const mockGoogleToken = 'mock-google-token'
      await socialLogin('google', mockGoogleToken)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in with Google')
      setIsLoading(false)
    }
  }
  
  const handleFacebookLogin = async () => {
    setError('')
    setIsLoading(true)
    
    try {
      // In a real implementation, this would use the Facebook OAuth API
      console.log('Facebook login clicked')
      // Mock implementation for demo purposes
      const mockFacebookToken = 'mock-facebook-token'
      await socialLogin('facebook', mockFacebookToken)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in with Facebook')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-papyrus">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/">
              <img
                className="h-12 w-auto"
                src="/src/assets/pharaoh-logo.svg"
                alt="Pharaoh's Compass"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-pharaoh-gold hover:text-pharaoh-gold/90">
                create a new account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <p className="text-sm font-medium text-gray-700">Sign in with</p>

                <div className="mt-1 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleGoogleLogin}
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={handleFacebookLogin}
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-papyrus px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-pharaoh-gold focus:outline-none focus:ring-pharaoh-gold sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-pharaoh-gold focus:outline-none focus:ring-pharaoh-gold sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-pharaoh-gold focus:ring-pharaoh-gold"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-pharaoh-gold hover:text-pharaoh-gold/90">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-pharaoh-gold py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-pharaoh-gold/90 focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/src/assets/destinations/luxor.svg"
          alt="Luxor Temple"
        />
      </div>
    </div>
  )
}
