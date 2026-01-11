import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeftIcon, BookmarkIcon, ShareIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Import real service with mock fallback
import { fetchCulturalInsight } from '../../services/culturalService';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch cultural insight using mock service
  const { data: insight, isLoading, error } = useQuery(
    ['culturalInsight', id],
    async () => {
      const response = await fetchCulturalInsight(id);
      return response.data;
    }
  );

  // Toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to the user's profile
  };

  // Share article
  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: insight?.title,
        text: insight?.overview,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !insight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading cultural insight</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Unable to load the requested cultural insight. Please try again later.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/cultural-insights')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                >
                  Back to Cultural Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/cultural-insights')}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Cultural Insights
        </button>
      </div>

      {/* Article header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-nile-blue p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                {insight.category || 'Culture'}
              </span>
              <h1 className="mt-2 text-3xl font-bold">{insight.title}</h1>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={toggleBookmark}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
              >
                {isBookmarked ? (
                  <BookmarkIconSolid className="h-6 w-6 text-pharaoh-gold" />
                ) : (
                  <BookmarkIcon className="h-6 w-6 text-white" />
                )}
              </button>
              <button
                type="button"
                onClick={shareArticle}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Share this article"
              >
                <ShareIcon className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-lg text-white/80">{insight.overview}</p>
        </div>
      </div>

      {/* Article content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Historical context */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-nile-blue mb-4">Historical Context</h2>
            <div className="prose prose-nile-blue max-w-none">
              <ReactMarkdown>{insight.historicalContext}</ReactMarkdown>
            </div>
          </div>

          {/* Cultural practices */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-nile-blue mb-4">Cultural Practices</h2>
            <div className="prose prose-nile-blue max-w-none">
              <ReactMarkdown>{insight.culturalPractices}</ReactMarkdown>
            </div>
          </div>

          {/* Modern relevance */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-nile-blue mb-4">Modern Relevance</h2>
            <div className="prose prose-nile-blue max-w-none">
              <ReactMarkdown>{insight.modernRelevance}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Interesting facts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-nile-blue mb-4">Interesting Facts</h3>
            <ul className="space-y-4">
              {insight.interestingFacts.map((fact, index) => (
                <li key={index} className="flex items-start">
                  <LightBulbIcon className="h-5 w-5 text-pharaoh-gold mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips for travelers */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-nile-blue mb-4">Tips for Travelers</h3>
            <ul className="space-y-4">
              {insight.tipsForTravelers.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-nile-blue mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related topics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-nile-blue mb-4">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {insight.relatedTopics.map((topic, index) => (
                <Link
                  key={index}
                  to={`/cultural-insights/search?q=${encodeURIComponent(topic)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-nile-blue hover:text-white transition-colors"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
