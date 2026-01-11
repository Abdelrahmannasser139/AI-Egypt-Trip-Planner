import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { 
  UserCircleIcon, 
  PencilIcon, 
  ArrowPathIcon, 
  ShieldCheckIcon, 
  MapIcon, 
  BookmarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// Import components
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    interests: currentUser?.interests || [],
    profileImage: currentUser?.profileImage || '',
  });
  
  // Fetch user itineraries
  const { data: itineraries, isLoading: isLoadingItineraries } = useQuery(
    'userItineraries',
    async () => {
      const response = await axios.get('/api/itineraries/user');
      return response.data.data;
    }
  );
  
  // Fetch user saved destinations
  const { data: savedDestinations, isLoading: isLoadingSaved } = useQuery(
    'userSavedDestinations',
    async () => {
      const response = await axios.get('/api/users/saved-destinations');
      return response.data.data;
    }
  );
  
  // Fetch user forum posts
  const { data: forumPosts, isLoading: isLoadingPosts } = useQuery(
    'userForumPosts',
    async () => {
      const response = await axios.get('/api/forum/user-posts');
      return response.data.data;
    }
  );
  
  // Update profile mutation
  const updateProfileMutation = useMutation(
    async (userData) => {
      const response = await updateProfile(userData);
      return response;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('userProfile');
        setIsEditing(false);
      }
    }
  );
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle interest selection
  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const interests = [...prev.interests];
      
      if (interests.includes(interest)) {
        return {
          ...prev,
          interests: interests.filter(i => i !== interest),
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest],
        };
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };
  
  // Interest options
  const interestOptions = [
    'historical', 'cultural', 'adventure', 'relaxation', 
    'food', 'photography', 'architecture', 'nature', 'beach'
  ];
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoadingItineraries || isLoadingSaved || isLoadingPosts) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt={currentUser.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-24 w-24 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-nile-blue">{currentUser?.name}</h1>
            <p className="text-gray-600">{currentUser?.email}</p>
            {currentUser?.bio && <p className="mt-2">{currentUser.bio}</p>}
            
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {currentUser?.interests?.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-desert-sand text-hieroglyph-black"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setActiveTab('profile');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
            >
              <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Profile
          </button>
          
          <button
            onClick={() => setActiveTab('itineraries')}
            className={`${
              activeTab === 'itineraries'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Itineraries
          </button>
          
          <button
            onClick={() => setActiveTab('saved')}
            className={`${
              activeTab === 'saved'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Saved Places
          </button>
          
          <button
            onClick={() => setActiveTab('posts')}
            className={`${
              activeTab === 'posts'
                ? 'border-nile-blue text-nile-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Forum Posts
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-nile-blue">Edit Profile</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
                      />
                    </div>
                    
                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
                      />
                    </div>
                    
                    {/* Profile Image URL */}
                    <div>
                      <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                        Profile Image URL
                      </label>
                      <input
                        type="url"
                        id="profileImage"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
                      />
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-nile-blue focus:ring-nile-blue"
                    />
                  </div>
                  
                  {/* Interests */}
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Interests
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            formData.interests.includes(interest)
                              ? 'bg-nile-blue text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Submit buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                    >
                      {updateProfileMutation.isLoading ? (
                        <>
                          <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-nile-blue">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentUser?.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentUser?.email}</p>
                  </div>
                  
                  {currentUser?.location && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1 text-sm text-gray-900">{currentUser.location}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser?.createdAt ? formatDate(currentUser.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
                
                {currentUser?.bio && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentUser.bio}</p>
                  </div>
                )}
                
                {currentUser?.interests && currentUser.interests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Travel Interests</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {currentUser.interests.map((interest) => (
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
              </div>
            )}
          </div>
        )}
        
        {/* Itineraries tab */}
        {activeTab === 'itineraries' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-nile-blue">My Itineraries</h2>
              <a
                href="/itinerary-planner"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
              >
                Create New Itinerary
              </a>
            </div>
            
            {itineraries && itineraries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map((itinerary) => (
                  <a
                    key={itinerary.id}
                    href={`/itineraries/${itinerary.id}`}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        {itinerary.coverImage ? (
                          <img
                            src={itinerary.coverImage}
                            alt={itinerary.title}
                            className="object-cover group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <MapIcon className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-nile-blue group-hover:text-nile-blue/80">
                          {itinerary.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {itinerary.description || 'No description'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>
                            {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MapIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No itineraries yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first itinerary.</p>
                <div className="mt-6">
                  <a
                    href="/itinerary-planner"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                  >
                    Create Itinerary
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Saved Places tab */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-bold text-nile-blue mb-4">Saved Places</h2>
            
            {savedDestinations && savedDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedDestinations.map((destination) => (
                  <a
                    key={destination.id}
                    href={`/destinations/${destination.id}`}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        {destination.coverImage ? (
                          <img
                            src={destination.coverImage}
                            alt={destination.name}
                            className="object-cover group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <MapIcon className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-nile-blue group-hover:text-nile-blue/80">
                          {destination.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {destination.description || 'No description'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <BookmarkIcon className="h-4 w-4 mr-1" />
                          <span>Saved on {formatDate(destination.savedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No saved places</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse destinations and save your favorites for later.
                </p>
                <div className="mt-6">
                  <a
                    href="/destinations"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                  >
                    Explore Destinations
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Forum Posts tab */}
        {activeTab === 'posts' && (
          <div>
            <h2 className="text-xl font-bold text-nile-blue mb-4">My Forum Posts</h2>
            
            {forumPosts && forumPosts.length > 0 ? (
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <a
                    key={post.id}
                    href={`/forum/${post.topicId}#post-${post.id}`}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <h3 className="text-lg font-medium text-nile-blue group-hover:text-nile-blue/80">
                        {post.topicTitle}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Posted on {formatDate(post.createdAt)}</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No forum posts yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Join the community and share your experiences.
                </p>
                <div className="mt-6">
                  <a
                    href="/forum"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-nile-blue hover:bg-nile-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nile-blue"
                  >
                    Visit Forum
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
