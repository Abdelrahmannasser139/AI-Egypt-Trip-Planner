import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { 
  CalendarIcon, 
  MapIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  PencilIcon, 
  TrashIcon, 
  ShareIcon,
  ArrowPathIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ChatInterface from '../../components/chatbot/ChatInterface';

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  
  // Fetch itinerary details
  const { data: itinerary, isLoading, error } = useQuery(
    ['itinerary', id],
    async () => {
      const response = await axios.get(`/api/itineraries/${id}`);
      return response.data.data;
    }
  );

  // Initialize Google Map
  useEffect(() => {
    if (itinerary && !mapLoaded && itinerary.destinations && itinerary.destinations.length > 0) {
      const loadMap = async () => {
        try {
          const { Loader } = await import('@googlemaps/js-api-loader');
          const loader = new Loader({
            apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
            version: 'weekly',
          });
          
          loader.load().then(() => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
              center: { 
                lat: itinerary.destinations[0].location.latitude, 
                lng: itinerary.destinations[0].location.longitude 
              },
              zoom: 10,
              mapId: 'pharaohs-compass-map',
            });
            
            // Add markers for all destinations
            const bounds = new window.google.maps.LatLngBounds();
            
            itinerary.destinations.forEach((destination, index) => {
              const position = { 
                lat: destination.location.latitude, 
                lng: destination.location.longitude 
              };
              
              const marker = new window.google.maps.Marker({
                position,
                map,
                title: destination.name,
                label: {
                  text: (index + 1).toString(),
                  color: '#ffffff'
                },
                animation: window.google.maps.Animation.DROP,
              });
              
              bounds.extend(position);
            });
            
            // Fit map to show all markers
            map.fitBounds(bounds);
            
            setMapLoaded(true);
          });
        } catch (error) {
          console.error('Error loading Google Maps:', error);
        }
      };
      
      loadMap();
    }
  }, [itinerary, mapLoaded]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading itinerary. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!itinerary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Itinerary not found. It may have been deleted or you don't have permission to view it.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Format dates
  const formattedStartDate = format(parseISO(itinerary.startDate), 'MMM d, yyyy');
  const formattedEndDate = format(parseISO(itinerary.endDate), 'MMM d, yyyy');
  
  // Get budget display
  const getBudgetDisplay = (budget) => {
    switch (budget) {
      case 'budget':
        return 'Budget-friendly';
      case 'moderate':
        return 'Moderate';
      case 'luxury':
        return 'Luxury';
      default:
        return budget;
    }
  };
  
  // Get travel style display
  const getTravelStyleDisplay = (style) => {
    switch (style) {
      case 'solo':
        return 'Solo Traveler';
      case 'couple':
        return 'Couple';
      case 'family':
        return 'Family';
      case 'friends':
        return 'Friends';
      case 'group':
        return 'Group';
      default:
        return style;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Itinerary header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-nile-blue">{itinerary.title}</h1>
            <p className="text-gray-600 mt-1">{itinerary.description}</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => navigate(`/itinerary-planner/edit/${id}`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
            >
              <ShareIcon className="h-4 w-4 mr-1" />
              Share
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
            >
              <PrinterIcon className="h-4 w-4 mr-1" />
              Print
            </button>
          </div>
        </div>
        
        {/* Itinerary metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-nile-blue mr-2" />
            <div>
              <p className="text-xs text-gray-500">Dates</p>
              <p className="text-sm font-medium">{formattedStartDate} - {formattedEndDate}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 text-nile-blue mr-2" />
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="text-sm font-medium">{getBudgetDisplay(itinerary.budget)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 text-nile-blue mr-2" />
            <div>
              <p className="text-xs text-gray-500">Travel Style</p>
              <p className="text-sm font-medium">{getTravelStyleDisplay(itinerary.travelStyle)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <MapIcon className="h-5 w-5 text-nile-blue mr-2" />
            <div>
              <p className="text-xs text-gray-500">Destinations</p>
              <p className="text-sm font-medium">{itinerary.destinations?.length || 0} locations</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('daily')}
            className={`${
              activeTab === 'daily'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Daily Itinerary
          </button>
          
          <button
            onClick={() => setActiveTab('map')}
            className={`${
              activeTab === 'map'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Map
          </button>
          
          <button
            onClick={() => setShowChatbot(!showChatbot)}
            className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent text-pharaoh-gold hover:text-pharaoh-gold/80 font-medium text-sm"
          >
            Ask AI Assistant
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {showChatbot ? (
        <div className="bg-white rounded-lg shadow-md p-6 h-[700px]">
          <ChatInterface itineraryContext={itinerary} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-bold text-nile-blue mb-4">Trip Overview</h2>
              
              {/* Destinations */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Destinations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {itinerary.destinations?.map((destination) => (
                    <Link
                      key={destination.id}
                      to={`/destinations/${destination.id}`}
                      className="group block"
                    >
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                        {destination.coverImage ? (
                          <img
                            src={destination.coverImage}
                            alt={destination.name}
                            className="object-cover group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <MapIcon className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-nile-blue group-hover:text-nile-blue/80">
                        {destination.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Interests */}
              {itinerary.interests && itinerary.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-desert-sand text-hieroglyph-black"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notes */}
              {itinerary.notes && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <div className="prose prose-nile-blue max-w-none">
                    <p>{itinerary.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Daily Itinerary tab */}
          {activeTab === 'daily' && (
            <div>
              <h2 className="text-xl font-bold text-nile-blue mb-4">Daily Itinerary</h2>
              
              {Object.keys(itinerary.days || {}).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(itinerary.days).map(([day, activities]) => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-nile-blue mb-2">
                        Day {day}
                      </h3>
                      
                      <div className="space-y-4">
                        {activities.map((activity, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-nile-blue/10 flex items-center justify-center">
                              <span className="text-nile-blue font-medium">{activity.time || '—'}</span>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium">{activity.title}</h4>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              {activity.location && (
                                <p className="text-xs text-gray-500 mt-1">
                                  <MapIcon className="inline-block h-3 w-3 mr-1" />
                                  {activity.location}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No daily plan yet</h3>
                  <p className="mt-1 text-sm text-gray-500">This itinerary doesn't have a daily plan yet.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => navigate(`/itinerary-planner/edit/${id}`)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                    >
                      <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Edit Itinerary
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Map tab */}
          {activeTab === 'map' && (
            <div>
              <h2 className="text-xl font-bold text-nile-blue mb-4">Trip Map</h2>
              
              <div id="map" className="h-[500px] rounded-lg"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItineraryDetailPage;
