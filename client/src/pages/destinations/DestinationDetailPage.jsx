import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { StarIcon, ClockIcon, CurrencyDollarIcon, CalendarIcon, MapPinIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DestinationMap from '../../components/common/DestinationMap';

// Import consolidated destination service
import { fetchEgyptianSiteById } from '../../services/destinationService';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');


  // Fetch destination details using mock data service
  const { data: destination, isLoading, error } = useQuery(
    ['destination', id],
    async () => {
      const response = await fetchEgyptianSiteById(id);
      return response.data;
    }
  );

  // Mock reviews data
  const reviews = [];

  // Generate activities based on destination type and category
  const generateActivitiesForDestination = (destination) => {
    if (!destination) return [];

    const baseActivities = [];
    const category = destination.category?.toLowerCase();
    const name = destination.name?.toLowerCase();

    // Historical sites activities
    if (category === 'historical') {
      baseActivities.push(
        {
          id: 'guided-tour',
          name: 'Expert Egyptologist Guide',
          description: `Join a qualified Egyptologist for an in-depth exploration of ${destination.name}'s rich history and archaeological significance.`,
          duration: 120,
          category: 'Educational',
          price: { amount: 600, currency: 'EGP' },
          images: [destination.coverImage]
        },
        {
          id: 'photography-workshop',
          name: 'Photography Workshop',
          description: 'Learn to capture stunning photos of ancient architecture and hieroglyphs with professional photography tips.',
          duration: 90,
          category: 'Photography',
          price: { amount: 300, currency: 'EGP' },
          images: [destination.coverImage]
        }
      );

      // Pyramid-specific activities
      if (name.includes('pyramid') || name.includes('giza')) {
        baseActivities.push(
          {
            id: 'pyramid-interior',
            name: 'Great Pyramid Interior Tour',
            description: 'Enter the Great Pyramid and explore the ancient burial chambers and passages.',
            duration: 60,
            category: 'Adventure',
            price: { amount: 440, currency: 'EGP' },
            images: [destination.coverImage]
          },
          {
            id: 'camel-ride',
            name: 'Camel Ride Around Pyramids',
            description: 'Experience the desert like ancient travelers with a traditional camel ride around the pyramid complex.',
            duration: 45,
            category: 'Adventure',
            price: { amount: 150, currency: 'EGP' },
            images: [destination.coverImage]
          },
          {
            id: 'horse-carriage',
            name: 'Horse Carriage Tour',
            description: 'Explore the Giza plateau in a traditional horse-drawn carriage.',
            duration: 30,
            category: 'Adventure',
            price: { amount: 100, currency: 'EGP' },
            images: [destination.coverImage]
          }
        );
      }

      // Temple-specific activities
      if (name.includes('temple') || name.includes('karnak') || name.includes('luxor')) {
        baseActivities.push(
          {
            id: 'sound-light-show',
            name: 'Sound & Light Show',
            description: 'Experience the temple come alive with a spectacular evening sound and light presentation.',
            duration: 60,
            category: 'Entertainment',
            price: { amount: 300, currency: 'EGP' },
            images: [destination.coverImage]
          },
          {
            id: 'private-guide',
            name: 'Private Egyptologist Guide',
            description: 'Explore with a qualified Egyptologist who will reveal the temple\'s secrets and hieroglyphic meanings.',
            duration: 120,
            category: 'Educational',
            price: { amount: 800, currency: 'EGP' },
            images: [destination.coverImage]
          },
          {
            id: 'sunrise-tour',
            name: 'Sunrise Temple Tour',
            description: 'Visit the temple at sunrise for the most magical lighting and fewer crowds.',
            duration: 120,
            category: 'Educational',
            price: { amount: 350, currency: 'EGP' },
            images: [destination.coverImage]
          }
        );
      }
    }

    // Beach/nature activities
    if (category === 'beach' || category === 'nature') {
      baseActivities.push(
        {
          id: 'snorkeling',
          name: 'Snorkeling Adventure',
          description: 'Discover the underwater world of the Red Sea with its vibrant coral reefs and marine life.',
          duration: 180,
          category: 'Water Sports',
          price: { amount: 400, currency: 'EGP' },
          images: [destination.coverImage]
        },
        {
          id: 'diving',
          name: 'Scuba Diving Experience',
          description: 'Explore deeper waters with certified diving instructors and discover hidden underwater treasures.',
          duration: 240,
          category: 'Water Sports',
          price: { amount: 1200, currency: 'EGP' },
          images: [destination.coverImage]
        },
        {
          id: 'boat-trip',
          name: 'Glass Bottom Boat Tour',
          description: 'See the coral reefs and marine life without getting wet through the glass bottom of the boat.',
          duration: 120,
          category: 'Water Sports',
          price: { amount: 300, currency: 'EGP' },
          images: [destination.coverImage]
        },
        {
          id: 'fishing-trip',
          name: 'Deep Sea Fishing',
          description: 'Half-day fishing trip in the Red Sea with equipment and guide included.',
          duration: 240,
          category: 'Water Sports',
          price: { amount: 600, currency: 'EGP' },
          images: [destination.coverImage]
        }
      );
    }

    // Religious sites activities
    if (category === 'religious') {
      baseActivities.push(
        {
          id: 'spiritual-tour',
          name: 'Spiritual Heritage Tour',
          description: 'Learn about the religious significance and spiritual practices associated with this sacred site.',
          duration: 90,
          category: 'Cultural',
          price: { amount: 250, currency: 'EGP' },
          images: [destination.coverImage]
        },
        {
          id: 'meditation-session',
          name: 'Meditation & Reflection',
          description: 'Find peace and tranquility in this sacred space with guided meditation sessions.',
          duration: 60,
          category: 'Wellness',
          price: { amount: 100, currency: 'EGP' },
          images: [destination.coverImage]
        }
      );
    }

    // Cultural sites activities
    if (category === 'cultural') {
      baseActivities.push(
        {
          id: 'cultural-immersion',
          name: 'Cultural Immersion Experience',
          description: 'Engage with local traditions, crafts, and customs for an authentic cultural experience.',
          duration: 150,
          category: 'Cultural',
          price: { amount: 400, currency: 'EGP' },
          images: [destination.coverImage]
        },
        {
          id: 'traditional-crafts',
          name: 'Traditional Crafts Workshop',
          description: 'Learn traditional handicrafts and take home your own handmade souvenirs.',
          duration: 120,
          category: 'Workshop',
          price: { amount: 350, currency: 'EGP' },
          images: [destination.coverImage]
        }
      );
    }

    // Urban/recreation activities
    if (category === 'urban' || category === 'recreation') {
      baseActivities.push(
        {
          id: 'walking-tour',
          name: 'Guided Walking Tour',
          description: 'Explore the area on foot with a knowledgeable local guide who knows all the hidden gems.',
          duration: 120,
          category: 'Sightseeing',
          price: { amount: 180, currency: 'EGP' },
          images: [destination.coverImage]
        },
        {
          id: 'local-cuisine',
          name: 'Food & Culture Tour',
          description: 'Sample authentic local dishes and learn about the culinary traditions of the region.',
          duration: 180,
          category: 'Food & Drink',
          price: { amount: 450, currency: 'EGP' },
          images: [destination.coverImage]
        }
      );
    }

    // Add common activities for all destinations
    baseActivities.push(
      {
        id: 'audio-guide',
        name: 'Audio Guide Tour',
        description: 'Explore at your own pace with a comprehensive audio guide available in multiple languages.',
        duration: 90,
        category: 'Self-Guided',
        price: { amount: 50, currency: 'EGP' },
        images: [destination.coverImage]
      },
      {
        id: 'group-tour',
        name: 'Group Guided Tour',
        description: 'Join a small group tour with an experienced guide sharing fascinating stories and insights.',
        duration: 120,
        category: 'Educational',
        price: { amount: 200, currency: 'EGP' },
        images: [destination.coverImage]
      },
      {
        id: 'photography-session',
        name: 'Professional Photography',
        description: 'Capture your visit with a professional photographer who knows the best angles and lighting.',
        duration: 60,
        category: 'Photography',
        price: { amount: 500, currency: 'EGP' },
        images: [destination.coverImage]
      }
    );

    return baseActivities;
  };

  const activities = generateActivitiesForDestination(destination);



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
              <h3 className="text-sm font-medium text-red-800">Error loading destination</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Unable to load destination details. Please try again later.</p>
              </div>
              <div className="mt-4">
                <Link
                  to="/destinations"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                >
                  Back to Destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return null;
  }

  // Render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.round(rating) ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            )}
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-8">
        {destination.coverImage ? (
          <img
            src={destination.coverImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <MapPinIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-pharaoh-gold text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
            </span>
            <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {destination.region}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">{destination.name}</h1>
          <p className="text-white/80 mt-2 max-w-3xl">{destination.shortDescription}</p>

          <div className="flex items-center mt-4 space-x-6">
            {destination.averageRating > 0 && (
              <div className="flex items-center text-white">
                {renderStarRating(destination.averageRating)}
                <span className="ml-1">({destination.reviewCount} reviews)</span>
              </div>
            )}

            {destination.visitDuration && (
              <div className="flex items-center text-white">
                <ClockIcon className="h-5 w-5 mr-1" />
                <span>{destination.visitDuration}</span>
              </div>
            )}

            {destination.bestTimeToVisit && (
              <div className="flex items-center text-white">
                <CalendarIcon className="h-5 w-5 mr-1" />
                <span>Best time: {destination.bestTimeToVisit}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          to={`/itinerary-planner?destination=${id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
        >
          Add to Itinerary
        </Link>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          Save
        </button>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {['details', 'map', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab
                  ? 'border-nile-blue text-nile-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Details tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* About Section */}
            <div>
              <h2 className="text-xl font-bold text-nile-blue mb-4">About {destination.name}</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{destination.description}</p>

                {destination.historicalFacts && destination.historicalFacts.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Historical Facts</h3>
                    <ul className="space-y-1">
                      {destination.historicalFacts.map((fact, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-nile-blue rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {destination.tips && destination.tips.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Visitor Tips</h3>
                    <ul className="space-y-1">
                      {destination.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-pharaoh-gold rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Visiting information */}
            <div>
              <h2 className="text-xl font-bold text-nile-blue mb-4">Visiting Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Opening hours */}
                {destination.openingHours && Object.keys(destination.openingHours).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2 text-nile-blue" />
                      Opening Hours
                    </h3>
                    <div className="mt-2 space-y-1">
                      {Object.entries(destination.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="text-gray-500">{day}</span>
                          <span className="text-gray-900">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entry fees */}
                {destination.entryFee && Object.keys(destination.entryFee).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-nile-blue" />
                      Entry Fees
                    </h3>
                    <div className="mt-2 space-y-1">
                      {Object.entries(destination.entryFee).map(([type, fee]) => (
                        <div key={type} className="flex justify-between text-sm">
                          <span className="text-gray-500">{type}</span>
                          <span className="text-gray-900">{fee}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best time to visit */}
                {destination.bestTimeToVisit && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-nile-blue" />
                      Best Time to Visit
                    </h3>
                    <p className="mt-2 text-sm text-gray-700">{destination.bestTimeToVisit}</p>
                  </div>
                )}

                {/* Facilities */}
                {destination.facilities && destination.facilities.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <InformationCircleIcon className="h-5 w-5 mr-2 text-nile-blue" />
                      Facilities
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {destination.facilities.map((facility, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nile-blue/10 text-nile-blue">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility */}
            {destination.accessibility && Object.keys(destination.accessibility).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-nile-blue mb-4">Accessibility</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    {Object.entries(destination.accessibility).map(([key, value]) => (
                      <div key={key} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${value ? 'text-green-500' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                          {value ? (
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span className="text-gray-700">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Available Activities */}
            <div>
              <h2 className="text-xl font-bold text-nile-blue mb-4">Available Activities</h2>
              {activities && activities.length > 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  {/* Group activities by category */}
                  {Object.entries(
                    activities.reduce((groups, activity) => {
                      const category = activity.category;
                      if (!groups[category]) groups[category] = [];
                      groups[category].push(activity);
                      return groups;
                    }, {})
                  ).map(([category, categoryActivities]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category}
                      </h3>
                      <ul className="space-y-2">
                        {categoryActivities.map((activity) => (
                          <li key={activity.id} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-nile-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <div>
                              <span className="font-medium text-gray-900">{activity.name}</span>
                              {activity.duration && (
                                <span className="text-sm text-gray-500 ml-2">
                                  ({activity.duration} min)
                                </span>
                              )}
                              {activity.price && activity.price.amount && (
                                <span className="text-sm text-gray-500 ml-2">
                                  - {activity.price.amount} {activity.price.currency}
                                </span>
                              )}
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Activities for this destination are currently being updated.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map tab */}
        {activeTab === 'map' && (
          <div>
            <h2 className="text-xl font-bold text-nile-blue mb-4">Location</h2>

            {/* Interactive Map */}
            <DestinationMap destination={destination} height="400px" />

            <div className="mt-4">
              <h3 className="font-medium text-gray-900">Location Details</h3>
              <p className="text-gray-700 mb-4">{destination.name}, {destination.region}, Egypt</p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${destination.name},${destination.region},Egypt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Get Directions on Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Reviews tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-nile-blue">Reviews</h2>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
              >
                Write a Review
              </button>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={review.user.profileImage || 'https://via.placeholder.com/40'}
                            alt={review.user.name}
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">{review.user.name}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div>
                        {renderStarRating(review.rating)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">{review.content}</p>
                    </div>
                    <div className="mt-2 flex space-x-4">
                      <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Helpful ({review.helpfulCount})
                      </button>
                      <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-sm text-gray-500">Be the first to share your experience.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
};

export default DestinationDetailPage;
