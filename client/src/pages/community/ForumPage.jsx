import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  ChatBubbleLeftRightIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ForumPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    category: '',
    search: '',
  });
  
  // Fetch forum posts
  const { data: posts, isLoading, error } = useQuery(
    ['forumPosts', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`/api/forum/posts?${params.toString()}`);
      return response.data.data;
    }
  );
  
  // Fetch categories
  const { data: categories } = useQuery(
    'forumCategories',
    async () => {
      const response = await axios.get('/api/forum/categories');
      return response.data.data;
    }
  );
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      search: '',
    });
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter posts
  const filteredPosts = posts || [];
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="relative bg-nile-blue rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-30"
            src="/src/assets/hero-image.svg"
            alt="Egyptian community"
          />
          <div className="absolute inset-0 bg-nile-blue mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Community <span className="text-pharaoh-gold">Forum</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl text-gray-300">
            Connect with fellow travelers, share experiences, and get insider tips for your Egyptian adventure.
          </p>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-nile-blue focus:ring-nile-blue"
                placeholder="Search topics..."
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 focus:border-nile-blue focus:ring-nile-blue"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <Link
              to="/forum/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Topic
            </Link>
          </div>
        </div>
      </div>
      
      {/* Forum posts */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Forum Topics</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                <Link to={`/forum/${post.id}`} className="block">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      {post.isSticky && (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-pharaoh-gold/20">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pharaoh-gold" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      {!post.isSticky && (
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-nile-blue truncate">{post.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-desert-sand text-hieroglyph-black">
                          {post.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <div className="flex items-center mr-4">
                          <UserCircleIcon className="h-4 w-4 mr-1" />
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                          <span>{post.replyCount} replies</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No topics found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.category
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Be the first to start a discussion!'}
              </p>
              <div className="mt-6">
                {filters.search || filters.category ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <Link
                    to="/forum/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    New Topic
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Forum categories */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <div key={category.value} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-nile-blue/10">
                  {category.icon || <ChatBubbleLeftRightIcon className="h-6 w-6 text-nile-blue" />}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{category.label}</h3>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={`/forum?category=${category.value}`}
                className="text-sm font-medium text-nile-blue hover:text-nile-blue/80"
              >
                View topics <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Community guidelines */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-nile-blue">Community Guidelines</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Our forum is a place for travelers to share experiences and help each other. Please be respectful, 
            provide constructive feedback, and keep discussions relevant to Egyptian travel.
          </p>
          
          <div className="mt-6 flex justify-center">
            <Link
              to="/community-guidelines"
              className="text-nile-blue hover:text-nile-blue/80 font-medium"
            >
              Read our full community guidelines <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
