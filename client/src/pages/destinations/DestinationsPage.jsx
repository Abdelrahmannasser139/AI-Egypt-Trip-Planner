import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { MapPinIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Import consolidated destination service
import { fetchAllEgyptianSites } from '../../services/destinationService';

const DestinationsPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    search: '',
  });

  // State for active filters
  const [showFilters, setShowFilters] = useState(false);

  // State for showing all destinations
  const [showAllDestinations, setShowAllDestinations] = useState(false);

  // Fetch destinations using mock data
  const { data: destinations, isLoading, error } = useQuery(
    'destinations',
    async () => {
      // Pass showAll: true to get all destinations instead of just 9
      const response = await fetchAllEgyptianSites({ showAll: true });
      return response.data;
    }
  );

  // Extract unique regions and categories for filters
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (destinations) {
      const uniqueRegions = [...new Set(destinations.map(dest => dest.region))];
      const uniqueCategories = [...new Set(destinations.map(dest => dest.category))];

      setRegions(uniqueRegions);
      setCategories(uniqueCategories);
    }
  }, [destinations]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // Reset show all when filters are applied
    if (value) {
      setShowAllDestinations(false);
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    // Reset show all when search is applied
    if (e.target.value) {
      setShowAllDestinations(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      region: '',
      search: '',
    });
    setShowAllDestinations(false);
  };

  // Filter destinations
  const filteredDestinations = destinations?.filter(destination => {
    // Filter by search term
    if (filters.search && !destination.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (filters.category && destination.category !== filters.category) {
      return false;
    }

    // Filter by region
    if (filters.region && destination.region !== filters.region) {
      return false;
    }

    return true;
  });

  // Determine which destinations to display
  const destinationsToShow = filteredDestinations ?
    (showAllDestinations || filters.search || filters.category || filters.region ?
      filteredDestinations :
      filteredDestinations.slice(0, 12)
    ) : [];

  // Check if there are more destinations to show
  const hasMoreDestinations = filteredDestinations &&
    !showAllDestinations &&
    !filters.search &&
    !filters.category &&
    !filters.region &&
    filteredDestinations.length > 12;

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
              <h3 className="text-sm font-medium text-red-800">Error loading destinations</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Unable to load destinations. Please try again later.</p>
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
            alt="Egyptian landmarks"
          />
          <div className="absolute inset-0 bg-nile-blue mix-blend-multiply" />
        </div>
        <div className="relative mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore Egyptian <span className="text-pharaoh-gold">Destinations</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl text-gray-300">
            Discover the wonders of ancient Egypt, from iconic pyramids to hidden gems along the Nile.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleSearchChange}
                className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-nile-blue sm:text-sm sm:leading-6"
                placeholder="Search destinations..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 hover:text-nile-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-nile-blue hover:text-nile-blue/80"
            >
              Reset all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Region filter */}
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                id="region"
                name="region"
                value={filters.region}
                onChange={handleFilterChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
              >
                <option value="">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Destinations grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinationsToShow?.length > 0 ? (
          destinationsToShow.map(destination => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.id}`}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 relative">
                {destination.coverImage ? (
                  <img
                    src={destination.coverImage}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <MapPinIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/80 rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                  {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 group-hover:text-nile-blue transition-colors">
                  {destination.name}
                </h3>
                <p className="text-sm text-gray-500">{destination.region}</p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">{destination.shortDescription}</p>

                <div className="mt-4 flex justify-between items-center">
                  {destination.averageRating > 0 ? (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-700">{destination.averageRating.toFixed(1)}</span>
                      <span className="ml-1 text-xs text-gray-500">({destination.reviewCount})</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">No ratings yet</span>
                  )}

                  <span className="inline-flex items-center text-xs font-medium text-nile-blue">
                    View details
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Show More Button */}
      {hasMoreDestinations && (
        <div className="mt-12 mb-6">
          {/* Decorative divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-4 py-1 text-xs text-gray-500 rounded-full">
                Showing {destinationsToShow.length} of {filteredDestinations?.length} destinations
              </span>
            </div>
          </div>

          {/* Enhanced Show More Button */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setShowAllDestinations(true)}
              className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-nile-blue to-pharaoh-gold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-nile-blue/30"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pharaoh-gold to-nile-blue rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                <svg className="mr-2 h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Show More Destinations
                <svg className="ml-2 h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>

            {/* Additional info */}
            <p className="mt-3 text-xs text-gray-600">
              {filteredDestinations?.length - destinationsToShow.length} more destinations available
            </p>
          </div>
        </div>
      )}

      {/* Show Less Button (when all destinations are shown) */}
      {showAllDestinations && !filters.search && !filters.category && !filters.region && (
        <div className="mt-12 mb-6">
          {/* Decorative divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-4 py-1 text-xs text-gray-500 rounded-full">
                All {filteredDestinations?.length} destinations shown
              </span>
            </div>
          </div>

          {/* Enhanced Show Less Button */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setShowAllDestinations(false)}
              className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:border-nile-blue hover:text-nile-blue transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="relative flex items-center">
                <svg className="mr-2 h-4 w-4 transform group-hover:-rotate-180 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Show Less
                <svg className="ml-2 h-4 w-4 transform group-hover:-rotate-180 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </span>
            </button>

            {/* Additional info */}
            <p className="mt-3 text-xs text-gray-600">
              Return to top destinations
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationsPage;
