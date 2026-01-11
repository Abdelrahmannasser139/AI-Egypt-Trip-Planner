import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MagnifyingGlassIcon, BookOpenIcon } from '@heroicons/react/24/outline';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Import real service with mock fallback
import { fetchCulturalTopics } from '../../services/culturalService';

const CulturalInsightsPage = () => {
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch cultural topics using mock service
  const { data: topics, isLoading, error } = useQuery(
    'culturalTopics',
    async () => {
      const response = await fetchCulturalTopics();
      return response.data;
    }
  );

  // Extract unique categories
  const categories = topics ? [...new Set(topics.map(topic => topic.category))].sort() : [];

  // Filter topics based on search and category
  const filteredTopics = topics?.filter(topic => {
    const matchesSearch = searchTerm === '' ||
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' || topic.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
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
              <h3 className="text-sm font-medium text-red-800">Error loading cultural topics</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Unable to load cultural topics. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="relative bg-nile-blue rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-30"
            src="/src/assets/hero-image.svg"
            alt="Egyptian cultural artifacts"
          />
          <div className="absolute inset-0 bg-nile-blue mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Egyptian <span className="text-pharaoh-gold">Cultural Insights</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl text-gray-300">
            Discover the rich cultural heritage of Egypt, from ancient traditions to modern customs.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-nile-blue sm:text-sm sm:leading-6"
                placeholder="Search cultural topics..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === ''
                ? 'bg-nile-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>

          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-nile-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Topics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics?.length > 0 ? (
          filteredTopics.map(topic => (
            <Link
              key={topic.id}
              to={`/cultural-insights/${topic.id}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nile-blue/10 text-nile-blue">
                      {topic.category}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900 hover:text-nile-blue transition-colors">
                      {topic.title}
                    </h3>
                    <p className="mt-2 text-gray-600 line-clamp-3">
                      {topic.description}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <BookOpenIcon className="h-8 w-8 text-pharaoh-gold" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    <strong>Why it matters:</strong> {topic.relevanceForTravelers}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="inline-flex items-center text-sm font-medium text-nile-blue">
                    Read more
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No topics found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or category filter.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cultural Q&A section */}
      <div className="mt-16 bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-nile-blue">Have a Question About Egyptian Culture?</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered cultural assistant can answer your questions about Egyptian history, customs, traditions, and more.
          </p>

          <div className="mt-8">
            <Link
              to="/cultural-insights/ask"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pharaoh-gold hover:bg-pharaoh-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pharaoh-gold"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalInsightsPage;
