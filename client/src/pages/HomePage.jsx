import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

// Import SVG images
import pyramidsSvg from '../assets/destinations/pyramids.svg'
import luxorSvg from '../assets/destinations/luxor.svg'
import redSeaSvg from '../assets/destinations/red-sea.svg'
import abuSimbelSvg from '../assets/destinations/abu-simbel.svg'

// Import JPG photos for featured destinations
import pyramidsGizaPhoto from '../assets/Pyramids_of_Giza.jpg'
import luxorTemplePhoto from '../assets/Egypt-Luxor-Temple1-SH.jpg'
import REDTemplePhoto from '../assets/Red-Sea-Coast.jpg'
import ABUTemplePhoto from '../assets/Abu Simble.jpg'
import homePagePhoto from '../assets/Home Page.jpg'

const featuredDestinations = [
  {
    id: 1,
    name: 'Pyramids of Giza',
    description: 'Visit the last remaining wonder of the ancient world',
    image: pyramidsGizaPhoto,
    link: '/destinations/1',
    objectPosition: 'center center',
  },
  {
    id: 2,
    name: 'Luxor Temple',
    description: 'Explore the magnificent temple complex of ancient Thebes',
    image: luxorTemplePhoto,
    link: '/destinations/4',
    objectPosition: 'center 30%',
  },
  {
    id: 3,
    name: 'Red Sea Coast',
    description: 'Discover world-class diving and pristine beaches',
    image: REDTemplePhoto,
    link: '/destinations/3',
    objectPosition: 'center 40%',
  },
  {
    id: 4,
    name: 'Abu Simbel',
    description: 'Marvel at the colossal temples of Ramses II',
    image: ABUTemplePhoto,
    link: '/destinations/4',
    objectPosition: 'center 35%',
  },
]

const features = [
  {
    name: 'Personalized Itineraries',
    description: 'Create custom travel plans tailored to your interests, budget, and schedule.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
  },
  {
    name: 'Cultural Insights',
    description: 'Access in-depth information about Egypt\'s rich history, traditions, and customs.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
      </svg>
    ),
  },
  {
    name: 'AI-Powered Recommendations',
    description: 'Get intelligent suggestions for destinations, activities, and dining options.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.5 20.25h-9a1.5 1.5 0 0 1-1.5-1.5v-10.5a1.5 1.5 0 0 1 1.5-1.5h9a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5Z" />
      </svg>
    ),
  },
  {
    name: 'Community Forum',
    description: 'Connect with fellow travelers, share experiences, and get insider tips.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
]

const testimonials = [
  {
    id: 1,
    content: 'Ray7 Masr made planning our Egypt trip so easy! The AI recommendations were spot-on and saved us hours of research.',
    author: 'Sarah Johnson',
    role: 'Adventure Traveler',
    avatar: '/src/assets/testimonials/avatar1.svg',
  },
  {
    id: 2,
    content: 'The cultural insights provided by this app enhanced our experience tremendously. We learned so much about Egyptian history!',
    author: 'Michael Chen',
    role: 'History Enthusiast',
    avatar: '/src/assets/testimonials/avatar2.svg',
  },
  {
    id: 3,
    content: 'As a solo female traveler, the community forum was invaluable for getting safety tips and connecting with other travelers.',
    author: 'Emma Rodriguez',
    role: 'Solo Traveler',
    avatar: '/src/assets/testimonials/avatar3.svg',
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to destinations page with search query
      window.location.href = `/destinations?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="bg-papyrus">
      {/* Hero section */}
      <div className="relative bg-nile-blue min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-40"
            src={homePagePhoto}
            alt="Ancient Egyptian temple"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-nile-blue/80 via-nile-blue/60 to-transparent" />
        </div>

        {/* Decorative Egyptian border pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pharaoh-gold via-amber-400 to-pharaoh-gold"></div>

        <div className="relative mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8">
          <div className="max-w-3xl">
            {/* Enhanced heading with Egyptian styling */}
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-pharaoh-gold/20 border border-pharaoh-gold/30 mb-4">
                <span className="text-pharaoh-gold text-sm font-medium">🏺 Your Gateway to Ancient Wonders</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight">
              Discover the Wonders of <span className="text-pharaoh-gold font-bold">Ancient Egypt</span>
            </h1>

            <p className="mt-8 max-w-2xl text-xl text-gray-200 leading-relaxed">
              Plan your perfect Egyptian adventure with <strong className="text-pharaoh-gold">AI-powered itineraries</strong>,
              deep cultural insights, and a community of fellow explorers. From the Pyramids to the Red Sea,
              your journey through 5,000 years of history starts here.
            </p>

            {/* Enhanced CTA buttons with better hierarchy */}
            <div className="mt-12 flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Link
                to="/destinations"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-pharaoh-gold rounded-lg shadow-lg hover:bg-pharaoh-gold/90 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:ring-offset-2"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-pharaoh-gold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center">
                  🗺️ Explore Destinations
                  <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/itinerary-planner"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-nile-blue bg-white rounded-lg shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span className="flex items-center">
                  ✨ Start Planning
                  <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center space-x-8 text-gray-300">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-pharaoh-gold">200+</span>
                <span className="ml-2 text-sm">Destinations</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-pharaoh-gold">AI</span>
                <span className="ml-2 text-sm">Powered</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-pharaoh-gold">5000+</span>
                <span className="ml-2 text-sm">Years of History</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="relative -mt-16 z-10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you want to explore?</h2>
              <p className="text-gray-600">Search destinations, ask questions, or get AI recommendations</p>
            </div>

            <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto">
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-l-xl border-0 py-4 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-pharaoh-gold text-lg"
                  placeholder="Search destinations, activities, or ask a question..."
                />
              </div>
              <button
                type="submit"
                className="rounded-r-xl bg-pharaoh-gold px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-pharaoh-gold/90 focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:ring-offset-2 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick search suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-sm text-gray-500">Popular searches:</span>
              {['Pyramids', 'Luxor', 'Red Sea', 'Nile Cruise', 'Cairo'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-pharaoh-gold hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured destinations section */}
      <div className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-pharaoh-gold/10 border border-pharaoh-gold/20 mb-6">
              <span className="text-pharaoh-gold text-sm font-medium">🏛️ Must-Visit Destinations</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Iconic <span className="text-pharaoh-gold">Egyptian</span> Wonders
            </h2>
            <p className="mt-4 text-xl leading-8 text-gray-600">
              From ancient pyramids to pristine beaches, discover the most breathtaking locations that define Egypt's timeless appeal.
            </p>
          </div>

          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 sm:mt-24 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {featuredDestinations.map((destination, index) => (
              <div key={destination.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ objectPosition: destination.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />

                  {/* Ranking badge */}
                  <div className="absolute top-4 left-4 bg-pharaoh-gold text-white text-sm font-bold px-3 py-1 rounded-full">
                    #{index + 1}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-pharaoh-gold transition-colors">
                    <Link to={destination.link}>
                      <span className="absolute inset-0" />
                      {destination.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-200 leading-relaxed">{destination.description}</p>

                  {/* Explore button */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center text-sm font-medium text-pharaoh-gold">
                      Explore Now
                      <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/destinations"
              className="group inline-flex items-center px-6 py-3 text-lg font-semibold text-pharaoh-gold hover:text-pharaoh-gold/90 bg-pharaoh-gold/10 hover:bg-pharaoh-gold/20 rounded-lg transition-all duration-200"
            >
              View All 200+ Destinations
              <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="bg-desert-sand py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Plan Your Journey with Confidence
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Our AI-powered platform provides everything you need for an unforgettable Egyptian adventure.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex-none rounded-lg bg-pharaoh-gold text-white flex items-center justify-center">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Travelers Say
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Discover how Ray7 Masr has helped travelers create unforgettable Egyptian experiences.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex flex-col justify-between bg-white p-6 shadow-md rounded-lg border border-gray-200">
                <div>
                  <p className="text-gray-700 italic">"{testimonial.content}"</p>
                </div>
                <div className="mt-6 flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={testimonial.avatar}
                    alt={testimonial.author}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA section */}
      <div className="relative bg-gradient-to-br from-nile-blue via-nile-blue to-blue-900 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-pharaoh-gold/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pharaoh-gold/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Egyptian pattern border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pharaoh-gold to-transparent"></div>

        <div className="relative mx-auto max-w-7xl py-20 sm:py-28 px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-pharaoh-gold/20 border border-pharaoh-gold/30 mb-8">
              <span className="text-pharaoh-gold text-sm font-medium">🌟 Start Your Adventure</span>
            </div>

            {/* Main heading */}
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Ready to explore <span className="text-pharaoh-gold font-bold">Egypt</span>?
            </h2>

            {/* Description */}
            <p className="mx-auto max-w-2xl text-xl leading-8 text-gray-200 mb-12">
              Join thousands of travelers who have discovered the magic of Egypt with our AI-powered planning tools,
              expert insights, and vibrant community of explorers.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-pharaoh-gold">200+</div>
                <div className="text-sm text-gray-300">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pharaoh-gold">10K+</div>
                <div className="text-sm text-gray-300">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pharaoh-gold">AI</div>
                <div className="text-sm text-gray-300">Powered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pharaoh-gold">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0 justify-center">
              <Link
                to="/destinations"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-pharaoh-gold rounded-xl shadow-lg hover:bg-pharaoh-gold/90 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:ring-offset-2"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-400 to-pharaoh-gold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center">
                  🗺️ Start Exploring
                  <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                to="/itinerary-planner"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-nile-blue bg-white rounded-xl shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                <span className="flex items-center">
                  ✨ Plan Your Trip
                  <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-300">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-pharaoh-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Free to Use</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-pharaoh-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">No Registration Required</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-pharaoh-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Expert Recommendations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pharaoh-gold to-transparent"></div>
      </div>
    </div>
  )
}
