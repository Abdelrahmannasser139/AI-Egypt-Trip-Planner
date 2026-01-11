import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContext'

// Lazy-loaded pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const DestinationsPage = lazy(() => import('./pages/destinations/DestinationsPage'))
const DestinationDetailPage = lazy(() => import('./pages/destinations/DestinationDetailPage'))
const ItineraryPlannerPage = lazy(() => import('./pages/itinerary/BasicChatItinerary'))
const ItineraryDetailPage = lazy(() => import('./pages/itinerary/ItineraryDetailPage'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))
const CulturalInsightsPage = lazy(() => import('./pages/cultural/CulturalInsightsPage'))
const ArticlePage = lazy(() => import('./pages/cultural/ArticlePage'))
const CulturalQuestionPage = lazy(() => import('./pages/cultural/CulturalQuestionPage'))
const ForumPage = lazy(() => import('./pages/community/ForumPage'))
const ForumTopicPage = lazy(() => import('./pages/community/ForumTopicPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/cultural-insights" element={<CulturalInsightsPage />} />
          <Route path="/cultural-insights/ask" element={<CulturalQuestionPage />} />
          <Route path="/cultural-insights/:id" element={<ArticlePage />} />

          {/* Protected routes */}
          <Route
            path="/itinerary-planner"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ItineraryPlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itineraries/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ItineraryDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/forum/:id" element={<ForumTopicPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App
