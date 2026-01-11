import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import { PlusIcon, TrashIcon, PaperAirplaneIcon, MapIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchAllEgyptianSites } from '../../services/destinationService';
import { sendGroqChatMessage, convertSuggestionsToDestinations, parseTripPlanFromText, generateEnhancedFallback } from '../../services/groqChatbotService';
import ItineraryMap from '../../components/maps/ItineraryMap';
import MapControlPanel from '../../components/maps/MapControlPanel';

// Inject custom styles for comprehensive plan formatting
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .comprehensive-plan-content h4 {
      font-size: 1.125rem !important;
      font-weight: 700 !important;
      color: #7c3aed !important;
      margin-top: 1.5rem !important;
      margin-bottom: 0.75rem !important;
      padding-bottom: 0.5rem !important;
      border-bottom: 2px solid #e9d5ff !important;
    }

    .comprehensive-plan-content p {
      margin-bottom: 1rem !important;
      line-height: 1.7 !important;
    }

    .comprehensive-plan-content li {
      margin-left: 1rem !important;
      margin-bottom: 0.5rem !important;
      list-style: none !important;
      position: relative !important;
    }

    .comprehensive-plan-content li::before {
      content: "•" !important;
      color: #7c3aed !important;
      font-weight: bold !important;
      position: absolute !important;
      left: -1rem !important;
    }

    .comprehensive-plan-content strong {
      font-weight: 700 !important;
      color: #1f2937 !important;
    }

    /* Custom scrollbar styles for day tabs */
    .scrollbar-thin {
      scrollbar-width: thin;
    }

    .scrollbar-thin::-webkit-scrollbar {
      height: 6px;
    }

    .scrollbar-track-gray-100::-webkit-scrollbar-track {
      background-color: #f3f4f6;
      border-radius: 3px;
    }

    .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
      background-color: #d1d5db;
      border-radius: 3px;
    }

    .scrollbar-thumb-gray-300:hover::-webkit-scrollbar-thumb,
    .hover\\:scrollbar-thumb-gray-400:hover::-webkit-scrollbar-thumb {
      background-color: #9ca3af;
    }

    /* Smooth scrolling for day tabs */
    .day-tabs-container {
      scroll-behavior: smooth;
    }
  `;
  document.head.appendChild(styleElement);
}

// Add custom styles for enhanced visual experience
const customStyles = `
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #D4AF37 #f1f1f1;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #D4AF37, #B8860B);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #B8860B, #D4AF37);
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

function BasicChatItinerary() {
  console.log("Rendering BasicChatItinerary");

  // Basic state for days and dates
  const [days, setDays] = useState({});
  const [dates] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd')
  });

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Amira, your friendly Egypt travel assistant 🏺 I'm excited to help plan your Egyptian adventure!\nTell me about your dream trip - your age, budget, how many days, what interests you, and any cities you'd like to visit. Just describe it naturally!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // State for extracted trip information
  const [extractedTripInfo, setExtractedTripInfo] = useState({
    age: null,
    budget: null,
    days: null,
    interests: [],
    cities: [],
    duration: null,
    travelStyle: null
  });

  // State for AI suggestions
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [tripPlan, setTripPlan] = useState(null);

  // State for destinations
  const [destinations, setDestinations] = useState([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);

  // State for map functionality
  const [showMap, setShowMap] = useState(false);
  const [selectedMapDay, setSelectedMapDay] = useState(null);
  const [showRoutes, setShowRoutes] = useState(true);

  // State for day management
  const [activeDay, setActiveDay] = useState('day-1');

  // State for comprehensive plan expansion
  const [expandedPlans, setExpandedPlans] = useState({});

  // Ref for day tabs scrolling
  const dayTabsRef = useRef(null);

  // Calculate number of days based on user's trip duration or default to 5
  const numDays = extractedTripInfo.days || 5;

  // Generate array of day numbers
  const dayNumbers = Array.from({ length: numDays }, (_, i) => i + 1);

  // Initialize days when trip duration changes
  useEffect(() => {
    if (extractedTripInfo.days && extractedTripInfo.days > 0) {
      console.log(`Initializing ${extractedTripInfo.days} days for the trip`);

      setDays(prev => {
        const newDays = { ...prev };

        // Initialize empty days up to the requested number
        for (let i = 1; i <= extractedTripInfo.days; i++) {
          const dayId = `day-${i}`;
          if (!newDays[dayId]) {
            newDays[dayId] = []; // Initialize empty day if it doesn't exist
          }
        }

        // Remove days beyond the requested number
        Object.keys(newDays).forEach(dayId => {
          const dayNumber = parseInt(dayId.split('-')[1]);
          if (dayNumber > extractedTripInfo.days) {
            delete newDays[dayId];
          }
        });

        return newDays;
      });

      // Set active day to day-1 if it's not already set or if current active day is beyond the trip duration
      const currentDayNumber = parseInt(activeDay.split('-')[1]);
      if (currentDayNumber > extractedTripInfo.days) {
        setActiveDay('day-1');
      }
    }
  }, [extractedTripInfo.days]);

  // Fetch destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoadingDestinations(true);
        const response = await fetchAllEgyptianSites();
        setDestinations(response.data);
        setIsLoadingDestinations(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setIsLoadingDestinations(false);
      }
    };

    fetchDestinations();
  }, []);

  // Add a new activity to a day
  const addActivity = (dayId) => {
    const newActivity = {
      id: `activity-${Date.now()}`,
      title: 'New Activity',
      description: 'Click to edit',
      time: '12:00',
      location: 'Location'
    };

    setDays(prev => ({
      ...prev,
      [dayId]: [...(prev[dayId] || []), newActivity]
    }));
  };

  // Remove an activity
  const removeActivity = (dayId, activityIndex) => {
    setDays(prev => {
      const day = [...prev[dayId]];
      day.splice(activityIndex, 1);
      // Recalculate times for remaining activities
      const updatedDay = recalculateActivityTimes(day);
      return { ...prev, [dayId]: updatedDay };
    });
  };

  // Function to calculate appropriate time for a new activity
  const calculateNextActivityTime = (existingActivities, insertIndex) => {
    // Default start time for first activity
    const startTime = { hours: 9, minutes: 0 }; // 9:00 AM

    // If no existing activities or inserting at the beginning
    if (!existingActivities || existingActivities.length === 0 || insertIndex === 0) {
      return formatTime(startTime.hours, startTime.minutes);
    }

    // Get the activity before the insertion point
    const previousActivityIndex = insertIndex - 1;
    const previousActivity = existingActivities[previousActivityIndex];

    if (!previousActivity || !previousActivity.time) {
      return formatTime(startTime.hours, startTime.minutes);
    }

    // Parse the previous activity's time
    const previousTime = parseTime(previousActivity.time);

    // Get estimated duration for the previous activity (default 3 hours if not specified)
    const duration = getActivityDuration(previousActivity);

    // Calculate next start time (previous start + duration + 30 min buffer)
    const nextTime = addMinutes(previousTime, duration + 30);

    return formatTime(nextTime.hours, nextTime.minutes);
  };

  // Function to recalculate all activity times in a day
  const recalculateActivityTimes = (activities) => {
    if (!activities || activities.length === 0) return activities;

    const startTime = { hours: 9, minutes: 0 }; // 9:00 AM
    let currentTime = { ...startTime };

    return activities.map((activity, index) => {
      const activityTime = formatTime(currentTime.hours, currentTime.minutes);
      const duration = getActivityDuration(activity);

      // Update current time for next activity (current start + duration + 30 min buffer)
      currentTime = addMinutes(currentTime, duration + 30);

      return {
        ...activity,
        time: activityTime
      };
    });
  };

  // Helper function to get estimated duration for an activity (in minutes)
  const getActivityDuration = (activity) => {
    // Default durations based on destination type or use visitDuration if available
    const defaultDurations = {
      'Pyramids of Giza': 240, // 4 hours
      'Sphinx of Giza': 60,    // 1 hour
      'Karnak Temple': 180,    // 3 hours
      'Luxor Temple': 120,     // 2 hours
      'Valley of the Kings': 180, // 3 hours
      'Temple of Hatshepsut': 90, // 1.5 hours
      'Philae Temple': 120,    // 2 hours
      'Saqqara Step Pyramid': 150, // 2.5 hours
      'Siwa Oasis': 480,       // 8 hours (full day)
    };

    // Try to get duration from the activity's location/title
    const locationKey = activity.location || activity.title?.replace('Visit ', '');
    if (defaultDurations[locationKey]) {
      return defaultDurations[locationKey];
    }

    // Default to 3 hours if not specified
    return 180;
  };

  // Helper function to parse time string (e.g., "09:00" -> {hours: 9, minutes: 0})
  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  };

  // Helper function to format time object to string
  const formatTime = (hours, minutes) => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Helper function to add minutes to a time object
  const addMinutes = (time, minutesToAdd) => {
    let totalMinutes = time.hours * 60 + time.minutes + minutesToAdd;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Cap at reasonable evening time (don't go past 6 PM)
    if (hours >= 18) {
      return { hours: 18, minutes: 0 };
    }

    return { hours, minutes };
  };

  // Handle drag and drop
  const handleDragEnd = (result) => {
    console.log("=== DRAG END EVENT ===");
    console.log("Full result:", result);

    const { source, destination, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) {
      console.log("❌ No destination found - dropped outside droppable area");
      return;
    }

    console.log("✅ Valid drop detected");
    console.log("Source:", source);
    console.log("Destination:", destination);
    console.log("Draggable ID:", draggableId);

    // If dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      console.log("⚠️ Dropped in same position - no action needed");
      return;
    }

    // If dragging from destinations to a day
    if (source.droppableId === 'destinations' && destination.droppableId.startsWith('day-')) {
      console.log("🎯 DESTINATION TO DAY DRAG DETECTED");
      console.log("From destinations to:", destination.droppableId);
      console.log("Source index:", source.index);
      console.log("Available destinations:", destinations);

      try {
        // Get the dragged destination
        const draggedDestination = destinations[source.index];
        console.log("📍 Dragged destination:", draggedDestination);

        if (!draggedDestination) {
          console.error("❌ Destination not found at index:", source.index);
          console.error("Available destinations length:", destinations.length);
          return;
        }

        const dayId = destination.droppableId;
        console.log("📅 Target day:", dayId);

        // Add the activity to the day with intelligent time scheduling
        setDays(prev => {
          const currentDayActivities = [...(prev[dayId] || [])];
          const insertIndex = destination.index !== undefined ? destination.index : currentDayActivities.length;

          // Calculate appropriate time for the new activity
          const activityTime = calculateNextActivityTime(currentDayActivities, insertIndex);
          console.log("⏰ Calculated time for new activity:", activityTime);

          // Create a new activity from the destination
          const newActivity = {
            id: `destination-${draggedDestination.id}-${Date.now()}`,
            title: `Visit ${draggedDestination.name}`,
            description: draggedDestination.shortDescription || `Explore ${draggedDestination.name}`,
            time: activityTime,
            location: draggedDestination.name,
            destinationId: draggedDestination.id,
            coverImage: draggedDestination.coverImage
          };

          console.log("✨ New activity created:", newActivity);

          // Insert the new activity
          currentDayActivities.splice(insertIndex, 0, newActivity);

          // Recalculate times for all activities to ensure proper scheduling
          const updatedActivities = recalculateActivityTimes(currentDayActivities);
          console.log("📋 Recalculated activities with times:", updatedActivities);

          const updatedDays = {
            ...prev,
            [dayId]: updatedActivities
          };

          return updatedDays;
        });

        // Add a message to the chat
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `✅ I've added ${draggedDestination.name} to your itinerary for Day ${dayId.split('-')[1]}!`
          }
        ]);

        // Auto-show map when first destination is added
        const totalActivities = Object.values(days).reduce((total, dayActivities) =>
          total + (dayActivities?.length || 0), 0
        );
        if (totalActivities === 0) { // This will be the first activity
          setTimeout(() => {
            setShowMap(true);
            setSelectedMapDay(dayId); // Show the day where the destination was added
          }, 1000); // Show map after a short delay
        }

        console.log("🎉 Successfully added destination to day!");
        return; // Exit early on success
      } catch (error) {
        console.error("❌ Error handling destination drag:", error);
        console.error("Error details:", error.stack);
      }
    }

    // If reordering within a day
    else if (source.droppableId.startsWith('day-') && destination.droppableId.startsWith('day-')) {
      console.log("Reordering within days");
      const sourceDay = source.droppableId;
      const destDay = destination.droppableId;

      try {
        // If moving between days
        if (sourceDay !== destDay) {
          console.log("Moving between days:", sourceDay, "to", destDay);
          const sourceActivities = [...(days[sourceDay] || [])];
          const destActivities = [...(days[destDay] || [])];

          if (sourceActivities.length <= source.index) {
            console.error("Source activity not found at index:", source.index);
            return;
          }

          // Remove from source day and add to destination day
          const [movedActivity] = sourceActivities.splice(source.index, 1);
          destActivities.splice(destination.index, 0, movedActivity);

          // Recalculate times for both days
          const updatedSourceActivities = recalculateActivityTimes(sourceActivities);
          const updatedDestActivities = recalculateActivityTimes(destActivities);

          setDays(prev => ({
            ...prev,
            [sourceDay]: updatedSourceActivities,
            [destDay]: updatedDestActivities
          }));
        }
        // If reordering within the same day
        else {
          console.log("Reordering within same day:", sourceDay);
          const dayActivities = [...(days[sourceDay] || [])];

          if (dayActivities.length <= source.index) {
            console.error("Activity not found at index:", source.index);
            return;
          }

          const [movedActivity] = dayActivities.splice(source.index, 1);
          dayActivities.splice(destination.index, 0, movedActivity);

          // Recalculate times for the reordered activities
          const updatedActivities = recalculateActivityTimes(dayActivities);

          setDays(prev => ({
            ...prev,
            [sourceDay]: updatedActivities
          }));
        }
      } catch (error) {
        console.error("Error handling activity reordering:", error);
      }
    }
  };

  // Groq-powered chat submission with RAG and trip planning
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoadingChat) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoadingChat(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      console.log('Sending message to Groq chatbot:', userMessage);

      // Try enhanced fallback first for better offline experience
      let response;
      try {
        // Send message to Groq-powered chatbot API
        response = await sendGroqChatMessage({
          message: userMessage,
          sessionId: sessionId,
          context: {
            type: 'itinerary_planning',
            extractedInfo: extractedTripInfo
          }
        });
      } catch (error) {
        console.log('Using enhanced fallback due to API error');
        const fallbackResponse = generateEnhancedFallback(userMessage, extractedTripInfo);
        response = {
          success: true,
          data: fallbackResponse
        };
      }

      if (response.success) {
        // Add bot response
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);

        // Update session ID
        if (response.data.sessionId) {
          setSessionId(response.data.sessionId);
        }

        // Update extracted trip information
        if (response.data.extractedInfo) {
          console.log('Updating extracted trip info:', response.data.extractedInfo);
          setExtractedTripInfo(prev => ({
            ...prev,
            ...response.data.extractedInfo
          }));
        }

        // Parse trip plan from response and populate day boxes
        if (response.data.response) {
          const parsedItinerary = parseTripPlanFromText(response.data.response);
          console.log('Parsed itinerary from AI response:', parsedItinerary);

          if (Object.keys(parsedItinerary).length > 0) {
            // Merge with existing days, AI-generated activities take priority
            setDays(prev => {
              const newDays = { ...prev };

              // Add parsed activities to respective days
              Object.keys(parsedItinerary).forEach(dayId => {
                const dayData = parsedItinerary[dayId];

                // Handle both old format (array) and new format (object with activities)
                let activities = [];
                if (Array.isArray(dayData)) {
                  // Old format - just activities array
                  activities = dayData;
                } else if (dayData && dayData.activities) {
                  // New format - object with activities and metadata
                  activities = dayData.activities;

                  // Store comprehensive text for display
                  if (dayData.isComprehensive && dayData.comprehensiveText) {
                    // Store the comprehensive text in a separate state or data structure
                    // For now, we'll add it as a special activity
                    activities.unshift({
                      id: `comprehensive-text-${dayId}`,
                      title: `📋 Full Day Plan`,
                      description: dayData.comprehensiveText,
                      time: '00:00',
                      location: 'Overview',
                      type: 'comprehensive-plan',
                      source: 'ai-comprehensive',
                      isComprehensivePlan: true
                    });
                  }
                }

                if (activities.length > 0) {
                  // Only recalculate times if it's not a comprehensive plan with preset times
                  const shouldRecalculateTimes = !dayData.isComprehensive ||
                    !activities.some(a => a.time && a.time !== '09:00');

                  const updatedActivities = shouldRecalculateTimes
                    ? recalculateActivityTimes(activities)
                    : activities;

                  newDays[dayId] = updatedActivities;
                }
              });

              return newDays;
            });

            // Show success message
            setTimeout(() => {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: '✅ Trip plan added to your day tabs above!'
              }]);
            }, 1000);

            // Auto-show map for the first day with activities
            const firstDayWithActivities = Object.keys(parsedItinerary).find(dayId =>
              parsedItinerary[dayId] && parsedItinerary[dayId].length > 0
            );
            if (firstDayWithActivities) {
              setTimeout(() => {
                setActiveDay(firstDayWithActivities);
                setShowMap(true);
              }, 2000);
            }
          }
        }

        // Handle MongoDB trip plan (direct from backend)
        if (response.data.tripPlan && response.data.tripPlan.days) {
          console.log('Received MongoDB trip plan with', response.data.tripPlan.days.length, 'days');
          
          // Process MongoDB trip plan format
          const processedDays = processMongoTripPlan(response.data.tripPlan);
          
          // Update days state with processed data
          setDays(prevDays => ({
            ...prevDays,
            ...processedDays
          }));
          
          setTripPlan(response.data.tripPlan);
          
          // Auto-select first day
          const firstDayKey = Object.keys(processedDays)[0];
          if (firstDayKey) {
            setActiveDay(firstDayKey);
            setShowMap(true);
          }
          
          // Add confirmation message
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now(),
              role: 'assistant',
              content: `✅ Complete ${response.data.tripPlan.days.length}-day itinerary added! Each day includes sites, restaurants (breakfast near first site, lunch at midpoint, dinner near second site), and distance calculations.`
            }]);
          }, 1000);
        }
        // Handle AI suggestions and trip plan
        else if (response.data.suggestions && response.data.suggestions.destinations) {
          console.log('Received AI suggestions:', response.data.suggestions.destinations.length, 'destinations');

          // Convert MongoDB suggestions to frontend format
          const convertedDestinations = convertSuggestionsToDestinations(response.data.suggestions);
          setAiSuggestions(convertedDestinations);

          // Store the full trip plan
          if (response.data.tripPlan) {
            setTripPlan(response.data.tripPlan);
          }

          // Auto-add high-priority destinations to the itinerary
          const highPriorityDestinations = convertedDestinations.filter(
            dest => dest.priority === 'high'
          );

          if (highPriorityDestinations.length > 0) {
            console.log('Auto-adding high priority destinations:', highPriorityDestinations.length);

            // Add to first available day
            const dayId = 'day-1';
            const newActivities = highPriorityDestinations.slice(0, 3).map((dest, index) => {
              const baseTime = 9 + (index * 3); // 9 AM, 12 PM, 3 PM
              return {
                id: `groq-suggestion-${dest.id}-${Date.now()}-${index}`,
                title: `Visit ${dest.name}`,
                description: dest.shortDescription || `Explore ${dest.name}`,
                time: `${baseTime.toString().padStart(2, '0')}:00`,
                location: dest.name,
                destinationId: dest.id,
                coverImage: dest.coverImage,
                aiSuggested: true,
                mongoData: dest.mongoData
              };
            });

            setDays(prev => ({
              ...prev,
              [dayId]: [...(prev[dayId] || []), ...newActivities]
            }));

            // Add confirmation message
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: `✨ I've added ${highPriorityDestinations.length} recommended destinations to your itinerary based on AI analysis! You can drag and drop them to rearrange or remove any you don't want.`
            }]);
          }

          // If trip plan is complete, show summary
          if (response.data.isComplete && response.data.tripPlan) {
            const summary = `🎉 Your complete ${response.data.tripPlan.user_preferences.duration_days}-day Egypt itinerary is ready!\n\n💰 Total estimated cost: ${response.data.tripPlan.trip_summary.total_trip_cost_egp.toFixed(2)} EGP\n💵 Remaining budget: ${response.data.tripPlan.trip_summary.remaining_budget_egp.toFixed(2)} EGP\n\nI've added the best destinations to your itinerary. You can drag and drop to customize!`;

            setMessages(prev => [...prev, {
              role: 'assistant',
              content: summary
            }]);
          }
        }
      } else {
        // Handle error
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.response || 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (error) {
      console.error('Error in chat submission:', error);

      // Use enhanced fallback for better offline experience
      const fallbackResponse = generateEnhancedFallback(userMessage, extractedTripInfo);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackResponse.response
      }]);

      // Update extracted info from fallback
      if (fallbackResponse.extractedInfo) {
        setExtractedTripInfo(prev => ({
          ...prev,
          ...fallbackResponse.extractedInfo
        }));
      }

      // Handle trip plan from fallback
      if (fallbackResponse.tripPlan) {
        setDays(prev => {
          const newDays = { ...prev };
          Object.keys(fallbackResponse.tripPlan).forEach(dayId => {
            const dayData = fallbackResponse.tripPlan[dayId];

            // Handle both old format (array) and new format (object with activities)
            let activities = [];
            if (Array.isArray(dayData)) {
              activities = dayData;
            } else if (dayData && dayData.activities) {
              activities = dayData.activities;
            }

            if (activities.length > 0) {
              const updatedActivities = recalculateActivityTimes(activities);
              newDays[dayId] = updatedActivities;
            }
          });
          return newDays;
        });

        // Show success message for fallback plan
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '✅ Sample plan created! Check your day tabs above!'
          }]);
        }, 1000);
      }
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Handle drag start for debugging
  const handleDragStart = (initial) => {
    console.log("🚀 DRAG STARTED");
    console.log("Initial:", initial);
    console.log("Dragging from:", initial.source.droppableId);
    console.log("Draggable ID:", initial.draggableId);
    console.log("Available destinations count:", destinations.length);
  };

  // Handle drag update for debugging
  const handleDragUpdate = (update) => {
    if (update.destination) {
      console.log("🎯 DRAGGING OVER:", update.destination.droppableId);
    } else {
      console.log("🌊 DRAGGING OVER INVALID AREA");
    }
  };

  // Day management handlers
  const handleDayChange = (dayId) => {
    setActiveDay(dayId);
    setSelectedMapDay(dayId); // Update map to show this day
  };

  // Map interaction handlers
  const handleMapDaySelect = (dayId) => {
    setSelectedMapDay(dayId);
    if (dayId) {
      setActiveDay(dayId); // Sync active day with map selection
    }
  };

  const handleToggleRoutes = () => {
    setShowRoutes(!showRoutes);
  };

  const handleCenterMap = () => {
    // This will be handled by the map component
    console.log('Centering map on all destinations');
  };

  const handleDestinationClick = (activity, dayId) => {
    console.log('Destination clicked:', activity.title, 'on', dayId);
    // You can add more functionality here, like showing details
  };

  // Toggle comprehensive plan expansion
  const toggleComprehensivePlan = (activityId) => {
    setExpandedPlans(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  // Function to convert MongoDB trip plan to frontend format
  const processMongoTripPlan = (mongoData) => {
    const processedDays = {};
    
    if (mongoData.days && Array.isArray(mongoData.days)) {
      mongoData.days.forEach((dayData, index) => {
        const dayId = `day-${dayData.day}`;
        const activities = [];
        
        // Process sites
        dayData.sites?.forEach((site, siteIndex) => {
          activities.push({
            id: `site-${dayData.day}-${siteIndex}`,
            title: site.name,
            location: site.city,
            description: site.description,
            time: `${site.opening_time || '09:00'} - ${site.closing_time || '17:00'}`,
            type: 'site',
            coverImage: null,
            cost_egp: site.cost_egp,
            distance_km: siteIndex > 0 ? dayData.distance_between_sites_km : null,
            activities: site.activities || [],
            similarity_score: site.similarity_score
          });
        });
        
        // Process restaurants
        const restaurants = dayData.restaurants;
        if (restaurants) {
          if (restaurants.breakfast) {
            activities.push({
              id: `restaurant-${dayData.day}-breakfast`,
              title: restaurants.breakfast.name,
              location: restaurants.breakfast.city,
              description: restaurants.breakfast.description,
              time: restaurants.breakfast.opening_hours || '08:00',
              type: 'restaurant',
              meal_type: 'breakfast',
              cost_egp: restaurants.breakfast.budget_egp,
              distance_km: restaurants.breakfast.distance_km,
              coverImage: null
            });
          }
          
          if (restaurants.lunch) {
            activities.push({
              id: `restaurant-${dayData.day}-lunch`,
              title: restaurants.lunch.name,
              location: restaurants.lunch.city,
              description: restaurants.lunch.description,
              time: restaurants.lunch.opening_hours || '12:00',
              type: 'restaurant',
              meal_type: 'lunch',
              cost_egp: restaurants.lunch.budget_egp,
              distance_km: restaurants.lunch.distance_km,
              coverImage: null
            });
          }
          
          if (restaurants.dinner) {
            activities.push({
              id: `restaurant-${dayData.day}-dinner`,
              title: restaurants.dinner.name,
              location: restaurants.dinner.city,
              description: restaurants.dinner.description,
              time: restaurants.dinner.opening_hours || '19:00',
              type: 'restaurant',
              meal_type: 'dinner',
              cost_egp: restaurants.dinner.budget_egp,
              distance_km: restaurants.dinner.distance_km,
              coverImage: null
            });
          }
        }
        
        // Add comprehensive itinerary if available
        if (dayData.comprehensive_itinerary) {
          activities.unshift({
            id: `comprehensive-${dayData.day}`,
            title: `Day ${dayData.day} - Complete Itinerary`,
            description: dayData.comprehensive_itinerary,
            type: 'comprehensive-plan',
            isComprehensivePlan: true,
            location: `Full day plan`,
            time: 'All day'
          });
        }
        
        processedDays[dayId] = activities;
      });
    }
    
    return processedDays;
  };

  // Scroll day tabs left/right
  const scrollDayTabs = (direction) => {
    if (dayTabsRef.current) {
      const scrollAmount = 200; // Adjust scroll distance
      const currentScroll = dayTabsRef.current.scrollLeft;
      const targetScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      dayTabsRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  // Format comprehensive plan content for better display
  const formatComprehensivePlan = (content) => {
    if (!content) return '';

    let formatted = content
      // Convert **text** to bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert time patterns to highlighted times
      .replace(/(\d{1,2}:\d{2}\s*(?:AM|PM))/g, '<span class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mx-1">🕐 $1</span>')
      // Convert budget amounts to highlighted currency
      .replace(/(\d+(?:,\d+)*\s*EGP)/g, '<span class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full mx-1">💰 $1</span>')
      // Convert section headers (lines starting with ** and ending with **)
      .replace(/^\*\*([^*]+)\*\*$/gm, '<h4>$1</h4>')
      // Convert bullet points to proper list items
      .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
      // Convert numbered lists
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      // Convert newlines to proper spacing
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    // Wrap content in paragraphs if not already wrapped
    if (!formatted.startsWith('<')) {
      formatted = '<p>' + formatted + '</p>';
    }

    // Wrap consecutive list items in ul tags
    formatted = formatted.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/g, (match) => {
      return '<ul class="space-y-2 my-4">' + match + '</ul>';
    });

    return formatted;
  };

  // Check if we have any planned destinations to show the map
  const hasPlannedDestinations = Object.values(days).some(dayActivities =>
    dayActivities && dayActivities.length > 0
  );

  // Get available days with activities
  const getAvailableDays = () => {
    const availableDays = [];
    for (let i = 1; i <= numDays; i++) {
      const dayId = `day-${i}`;
      availableDays.push({
        id: dayId,
        number: i,
        hasActivities: days[dayId] && days[dayId].length > 0,
        activityCount: days[dayId]?.length || 0
      });
    }
    return availableDays;
  };

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragUpdate={handleDragUpdate}
    >
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-nile-blue via-pharaoh-gold to-nile-blue bg-clip-text text-transparent mb-4">
              Plan Your Egyptian Adventure
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let our AI-powered assistant help you create the perfect itinerary for your journey through ancient Egypt
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Chat and Destinations */}
            <div className="lg:w-2/5 space-y-6">
              {/* Enhanced Chat */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-[650px] flex flex-col overflow-hidden">
                {/* Enhanced Chat header */}
                <div className="bg-gradient-to-r from-nile-blue to-pharaoh-gold p-6 flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Pharaoh's Compass</h2>
                    <p className="text-white/80 text-sm">Your AI Travel Assistant</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Enhanced Chat messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-pharaoh-gold to-yellow-500'
                            : 'bg-gradient-to-r from-nile-blue to-blue-600'
                        }`}>
                          {message.role === 'user' ? (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          )}
                        </div>

                        {/* Message bubble */}
                        <div
                          className={`rounded-2xl p-4 shadow-sm ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-pharaoh-gold to-yellow-500 text-white'
                              : 'bg-white border border-gray-200 text-gray-800 shadow-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isLoadingChat && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="flex items-start space-x-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-nile-blue to-blue-600 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Chat input */}
                <div className="p-6 bg-white border-t border-gray-100">
                  <form onSubmit={handleChatSubmit}>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={isLoadingChat ? "AI is analyzing..." : "Tell me your age, budget, days, and interests for Egypt..."}
                          className="w-full border-2 border-gray-200 rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-pharaoh-gold focus:border-pharaoh-gold disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-sm"
                          disabled={isLoadingChat}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <SparklesIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-pharaoh-gold to-yellow-500 text-white p-4 rounded-2xl hover:from-yellow-500 hover:to-pharaoh-gold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                        disabled={!input.trim() || isLoadingChat}
                      >
                        {isLoadingChat ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <PaperAirplaneIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Enhanced Trip info display */}
                    {(extractedTripInfo.interests.length > 0 || extractedTripInfo.budget || extractedTripInfo.days) && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-pharaoh-gold/10 via-yellow-50 to-pharaoh-gold/10 rounded-2xl border border-pharaoh-gold/20">
                        <div className="text-sm text-pharaoh-gold font-bold mb-3 flex items-center">
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          AI Extracted Trip Information
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {extractedTripInfo.age && (
                            <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2">
                              <span className="text-lg">👤</span>
                              <span className="text-gray-700 font-medium">Age: {extractedTripInfo.age}+</span>
                            </div>
                          )}
                          {extractedTripInfo.budget && (
                            <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2">
                              <span className="text-lg">💰</span>
                              <span className="text-gray-700 font-medium">Budget: {extractedTripInfo.budget} EGP</span>
                            </div>
                          )}
                          {extractedTripInfo.days && (
                            <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2">
                              <span className="text-lg">📅</span>
                              <span className="text-gray-700 font-medium">Duration: {extractedTripInfo.days} days</span>
                            </div>
                          )}
                          {extractedTripInfo.interests.length > 0 && (
                            <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 col-span-2">
                              <span className="text-lg">🎯</span>
                              <span className="text-gray-700 font-medium">Interests: {extractedTripInfo.interests.join(', ')}</span>
                            </div>
                          )}
                          {extractedTripInfo.cities && extractedTripInfo.cities.length > 0 && (
                            <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-2 col-span-2">
                              <span className="text-lg">🏙️</span>
                              <span className="text-gray-700 font-medium">Cities: {extractedTripInfo.cities.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Enhanced AI Suggestions Box */}
              {aiSuggestions.length > 0 && (
                <div className="bg-gradient-to-br from-pharaoh-gold/10 via-yellow-50 to-nile-blue/10 rounded-2xl shadow-xl border border-pharaoh-gold/20 p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-pharaoh-gold to-nile-blue bg-clip-text text-transparent flex items-center">
                      <SparklesIcon className="h-6 w-6 mr-2 text-pharaoh-gold" />
                      AI-Powered Recommendations
                    </h2>
                    <div className="bg-gradient-to-r from-pharaoh-gold to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {aiSuggestions.length} suggestions
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Personalized recommendations based on your preferences and AI analysis:</p>

                  <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                    {aiSuggestions.slice(0, 8).map((suggestion, index) => (
                      <div key={suggestion.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
                        <div className="flex items-center space-x-4">
                          {suggestion.coverImage ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                              <img
                                src={suggestion.coverImage}
                                alt={suggestion.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pharaoh-gold/20 to-nile-blue/20 flex items-center justify-center" style={{display: 'none'}}>
                                <SparklesIcon className="h-8 w-8 text-pharaoh-gold" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pharaoh-gold/20 to-nile-blue/20 flex items-center justify-center flex-shrink-0 shadow-md">
                              <SparklesIcon className="h-8 w-8 text-pharaoh-gold" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{suggestion.name}</h4>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{suggestion.shortDescription}</p>
                            <div className="flex items-center flex-wrap gap-2">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                suggestion.priority === 'high' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                                suggestion.priority === 'medium' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200' :
                                'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                              }`}>
                                {suggestion.priority} priority
                              </span>
                              {suggestion.mongoData && suggestion.mongoData.similarity_score && (
                                <span className="text-xs bg-gradient-to-r from-pharaoh-gold/10 to-yellow-100 text-pharaoh-gold px-3 py-1 rounded-full font-medium border border-pharaoh-gold/20">
                                  AI Match: {(suggestion.mongoData.similarity_score * 100).toFixed(0)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {tripPlan && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-pharaoh-gold/30 shadow-md">
                      <h4 className="font-bold text-pharaoh-gold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Trip Summary
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl mb-1">💰</div>
                          <div className="font-bold text-gray-900">{tripPlan.trip_summary.total_trip_cost_egp.toFixed(0)} EGP</div>
                          <div className="text-xs text-gray-500">Total Cost</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl mb-1">💵</div>
                          <div className="font-bold text-gray-900">{tripPlan.trip_summary.remaining_budget_egp.toFixed(0)} EGP</div>
                          <div className="text-xs text-gray-500">Remaining</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl mb-1">📅</div>
                          <div className="font-bold text-gray-900">{tripPlan.user_preferences.duration_days}</div>
                          <div className="text-xs text-gray-500">Days</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Destinations Box */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-nile-blue to-pharaoh-gold bg-clip-text text-transparent">All Destinations</h2>
                  <div className="bg-gradient-to-r from-nile-blue to-pharaoh-gold text-white text-xs px-3 py-1 rounded-full font-medium">
                    {destinations.length} sites
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-pharaoh-gold" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.55 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.55 17 2V4H19C20.1 4 21 4.9 21 6V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V6C3 4.9 3.9 4 5 4H7Z"/>
                  </svg>
                  Drag destinations to add them to your itinerary
                </p>

                {isLoadingDestinations ? (
                  <div className="flex flex-col justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-pharaoh-gold border-t-transparent mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading destinations...</p>
                  </div>
                ) : (
                  <Droppable droppableId="destinations" isDropDisabled={true}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar"
                      >
                        {destinations && destinations.length > 0 ? (
                          destinations.map((destination, index) => (
                            <Draggable
                              key={destination.id.toString()}
                              draggableId={`destination-${destination.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-grab hover:scale-[1.02] group ${
                                    snapshot.isDragging ? 'opacity-50 rotate-2 scale-105 shadow-2xl' : ''
                                  }`}
                                  style={{
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <div className="flex items-center space-x-4">
                                    {destination.coverImage ? (
                                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                        <img
                                          src={destination.coverImage}
                                          alt={destination.name}
                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-nile-blue/20 to-pharaoh-gold/20 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <MapIcon className="h-8 w-8 text-nile-blue" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{destination.name}</h4>
                                      <p className="text-xs text-gray-500 mb-1">{destination.region}</p>
                                      <div className="flex items-center text-xs text-pharaoh-gold">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                        Historical Site
                                      </div>
                                    </div>
                                    <div className="text-gray-400 group-hover:text-pharaoh-gold transition-colors">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <MapIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-sm">No destinations available</p>
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
          </div>

            {/* Enhanced Right column - Itinerary builder */}
            <div className="lg:w-3/5">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-nile-blue/10 via-pharaoh-gold/10 to-nile-blue/10 p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-nile-blue to-pharaoh-gold rounded-full flex items-center justify-center">
                        <MapIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
                          Your Egyptian Adventure
                        </h2>
                        <p className="text-sm text-gray-600">
                          Plan each day of your journey • Drag destinations to build your itinerary
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-nile-blue to-pharaoh-gold text-white text-xs px-3 py-1 rounded-full font-medium">
                        {numDays} days
                      </div>
                      {/* Map Toggle for Desktop */}
                      {hasPlannedDestinations && (
                        <button
                          onClick={() => setShowMap(!showMap)}
                          className={`hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                            showMap
                              ? 'bg-pharaoh-gold text-white hover:bg-yellow-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <GlobeAltIcon className="w-4 h-4" />
                          <span className="text-xs">{showMap ? 'Hide' : 'Map'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day Tabs */}
                <div className="border-b border-gray-200 bg-gray-50 relative">
                  {/* Scroll indicators */}
                  {numDays > 7 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-gray-50/90 px-2 py-1 rounded-full text-xs text-gray-500 font-medium">
                      {numDays} days • Scroll →
                    </div>
                  )}
                  <div className={`flex overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pb-1 day-tabs-container ${numDays > 7 ? 'pr-24' : ''}`}>
                    {getAvailableDays().map((day) => (
                      <button
                        key={day.id}
                        onClick={() => handleDayChange(day.id)}
                        className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                          activeDay === day.id
                            ? 'border-pharaoh-gold text-pharaoh-gold bg-white'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Day {day.number}</span>
                          {day.hasActivities && (
                            <span className={`inline-flex items-center justify-center w-5 h-5 text-xs rounded-full ${
                              activeDay === day.id
                                ? 'bg-pharaoh-gold text-white'
                                : 'bg-gray-400 text-white'
                            }`}>
                              {day.activityCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Day Content */}
                <div className="p-6">
                  {(() => {
                    const dayNum = parseInt(activeDay.split('-')[1]);
                    const dayDate = format(
                      addDays(new Date(dates.startDate), dayNum - 1),
                      'EEEE, MMMM d, yyyy'
                    );

                    return (
                      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-md">
                        <div className="bg-gradient-to-r from-nile-blue/10 via-pharaoh-gold/10 to-nile-blue/10 p-5 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-nile-blue text-lg">Day {dayNum}</h3>
                              <p className="text-sm text-gray-600">{dayDate}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                                {days[activeDay]?.length || 0} activities
                              </div>
                              <div className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-nile-blue">{dayNum}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Check if this day has a comprehensive plan */}
                        {(() => {
                          const comprehensivePlan = days[activeDay]?.find(activity => activity.isComprehensivePlan);

                          if (comprehensivePlan) {
                            // Display comprehensive plan
                            return (
                              <div className="p-6">
                                <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl border border-purple-200 shadow-lg">
                                  {/* Header */}
                                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">📋</span>
                                      </div>
                                      <div>
                                        <h3 className="text-xl font-bold">Complete Day Plan</h3>
                                        <p className="text-purple-100 text-sm">AI-Generated Comprehensive Itinerary</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="p-6">
                                    <div className="prose prose-sm max-w-none">
                                      <div
                                        className="comprehensive-plan-content text-gray-800 leading-relaxed space-y-4"
                                        dangerouslySetInnerHTML={{
                                          __html: formatComprehensivePlan(comprehensivePlan.description)
                                        }}
                                      />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 flex space-x-3">
                                      <button
                                        onClick={() => removeActivity(activeDay, 0)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                      >
                                        Remove Plan
                                      </button>
                                      <button
                                        onClick={() => {/* Add regenerate functionality */}}
                                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                                      >
                                        Regenerate Plan
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            // Display regular droppable area for individual activities
                            return (
                              <Droppable droppableId={activeDay}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`p-5 min-h-[120px] transition-all duration-200 ${
                                      snapshot.isDraggingOver
                                        ? 'bg-gradient-to-br from-pharaoh-gold/5 via-yellow-50 to-nile-blue/5 border-2 border-dashed border-pharaoh-gold/30'
                                        : 'bg-gray-50/30'
                                    }`}
                                    data-day-id={activeDay}
                                  >
                              {days[activeDay]?.length > 0 ? (
                                days[activeDay].map((activity, index) => (
                                  <Draggable
                                    key={activity.id || `activity-${activeDay}-${index}`}
                                    draggableId={activity.id || `activity-${activeDay}-${index}`}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-grab mb-4 group ${
                                          snapshot.isDragging ? 'opacity-50 rotate-1 scale-105 shadow-2xl' : 'hover:scale-[1.02]'
                                        } ${activity.aiSuggested ? 'border-pharaoh-gold/30 bg-gradient-to-r from-white to-pharaoh-gold/5' : ''}`}
                                        style={{
                                          ...provided.draggableProps.style
                                        }}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-start space-x-4 flex-1">
                                            {activity.coverImage ? (
                                              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                                <img
                                                  src={activity.coverImage}
                                                  alt={activity.title}
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                                />
                                              </div>
                                            ) : (
                                              <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                                                activity.type === 'comprehensive-plan'
                                                  ? 'bg-gradient-to-br from-purple-100 to-purple-200'
                                                  : activity.type === 'restaurant'
                                                  ? 'bg-gradient-to-br from-red-100 to-red-200'
                                                  : 'bg-gradient-to-br from-nile-blue/20 to-pharaoh-gold/20'
                                              }`}>
                                                {activity.type === 'comprehensive-plan' ? (
                                                  <span className="text-2xl">📋</span>
                                                ) : activity.type === 'restaurant' ? (
                                                  <span className="text-2xl">🍽️</span>
                                                ) : (
                                                  <MapIcon className="h-8 w-8 text-nile-blue" />
                                                )}
                                              </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center space-x-2 mb-1">
                                                <h4 className="font-bold text-gray-900 text-sm truncate">{activity.title}</h4>
                                                {activity.aiSuggested && (
                                                  <span className="bg-gradient-to-r from-pharaoh-gold to-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                    AI
                                                  </span>
                                                )}
                                                {activity.isComprehensivePlan && (
                                                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                    Full Day Plan
                                                  </span>
                                                )}
                                              </div>
                                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                                {activity.time && (
                                                  <span className="flex items-center mr-3">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
                                                    </svg>
                                                    {activity.time}
                                                  </span>
                                                )}
                                                <span className="flex items-center mr-3">
                                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                  </svg>
                                                  {activity.location}
                                                </span>
                                                {activity.distance_km && (
                                                  <span className="flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full mr-2">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                      <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z"/>
                                                    </svg>
                                                    {activity.distance_km.toFixed(1)} km
                                                  </span>
                                                )}
                                                {activity.type === 'restaurant' && activity.meal_type && (
                                                  <span className={`flex items-center text-xs px-2 py-1 rounded-full ${
                                                    activity.meal_type === 'breakfast' ? 'bg-yellow-100 text-yellow-700' :
                                                    activity.meal_type === 'lunch' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-purple-100 text-purple-700'
                                                  }`}>
                                                    {activity.meal_type === 'breakfast' ? '☀️ Breakfast' :
                                                     activity.meal_type === 'lunch' ? '🌞 Lunch' : '🌙 Dinner'}
                                                  </span>
                                                )}
                                              </div>
                                              {activity.isComprehensivePlan ? (
                                                <div className="text-sm text-gray-700">
                                                  <div className={`${expandedPlans[activity.id] ? '' : 'line-clamp-3'}`}>
                                                    <div className="whitespace-pre-wrap">{activity.description}</div>
                                                  </div>
                                                  <button
                                                    onClick={() => toggleComprehensivePlan(activity.id)}
                                                    className="text-purple-600 hover:text-purple-800 font-medium text-xs mt-2 flex items-center"
                                                  >
                                                    {expandedPlans[activity.id] ? (
                                                      <>
                                                        <span>Show Less</span>
                                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                        </svg>
                                                      </>
                                                    ) : (
                                                      <>
                                                        <span>View Full Day Plan</span>
                                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                      </>
                                                    )}
                                                  </button>
                                                </div>
                                              ) : (
                                                <p className="text-sm text-gray-700 line-clamp-2">{activity.description}</p>
                                              )}
                                            </div>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => removeActivity(activeDay, index)}
                                            className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 ml-2"
                                          >
                                            <TrashIcon className="h-5 w-5" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))
                              ) : (
                                <div className={`flex flex-col items-center justify-center h-32 text-gray-400 rounded-xl border-2 border-dashed transition-all duration-200 ${
                                  snapshot.isDraggingOver
                                    ? 'border-pharaoh-gold/50 bg-pharaoh-gold/5 text-pharaoh-gold'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                  <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                  </svg>
                                  <p className="font-medium">No activities planned for this day</p>
                                  <p className="text-xs mt-1">Drag destinations here to add them</p>
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                            );
                          }
                        })()}

                        {/* Day Summary */}
                        {days[activeDay]?.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-gray-700 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L13.09 8.26L22 9L13.09 15.74L12 22L10.91 15.74L2 9L10.91 8.26L12 2Z"/>
                                  </svg>
                                  Distances
                                </h4>
                                {(() => {
                                  const sites = days[activeDay]?.filter(a => a.type === 'site') || [];
                                  const restaurants = days[activeDay]?.filter(a => a.type === 'restaurant') || [];
                                  const totalSiteDistance = sites.reduce((sum, site) => sum + (site.distance_km || 0), 0);
                                  const avgRestaurantDistance = restaurants.length > 0 
                                    ? restaurants.reduce((sum, r) => sum + (r.distance_km || 0), 0) / restaurants.length 
                                    : 0;
                                  
                                  return (
                                    <div className="space-y-1 text-xs">
                                      <div className="flex justify-between">
                                        <span>Between sites:</span>
                                        <span className="font-medium">{totalSiteDistance.toFixed(1)} km</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Avg to restaurants:</span>
                                        <span className="font-medium">{avgRestaurantDistance.toFixed(1)} km</span>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-gray-700 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17H13V11H11V17M11,9H13V7H11V9Z"/>
                                  </svg>
                                  Daily Cost
                                </h4>
                                {(() => {
                                  const totalCost = days[activeDay]?.reduce((sum, activity) => sum + (activity.cost_egp || 0), 0) || 0;
                                  return (
                                    <div className="text-xs">
                                      <div className="flex justify-between">
                                        <span>Total:</span>
                                        <span className="font-medium">{totalCost.toFixed(0)} EGP</span>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="bg-gray-50 p-4 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => addActivity(activeDay)}
                            className="flex items-center text-sm text-nile-blue hover:text-pharaoh-gold font-medium transition-colors duration-200 group"
                          >
                            <PlusIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                            Add Custom Activity
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Map Section - Show under the planning box when destinations are planned */}
                {hasPlannedDestinations && (
                  <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Map Header */}
                    <div className="bg-gradient-to-r from-nile-blue/10 via-pharaoh-gold/10 to-nile-blue/10 p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-nile-blue to-pharaoh-gold rounded-full flex items-center justify-center">
                            <GlobeAltIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-nile-blue to-pharaoh-gold bg-clip-text text-transparent">
                              Day {parseInt(activeDay.split('-')[1])} Journey Map
                            </h2>
                            <p className="text-sm text-gray-600">
                              Visualize your route and destinations for the selected day
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowMap(!showMap)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            showMap
                              ? 'bg-pharaoh-gold text-white hover:bg-yellow-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {showMap ? 'Hide Map' : 'Show Map'}
                        </button>
                      </div>
                    </div>

                    {/* Map Content */}
                    {showMap && (
                      <div className="p-6">
                        {/* Map - Full width for better visibility */}
                        <div className="mb-6">
                          <ItineraryMap
                            days={{ [activeDay]: days[activeDay] }}
                            selectedDay={activeDay}
                            height="400px"
                            onDestinationClick={handleDestinationClick}
                          />
                        </div>

                        {/* Map Controls and Info - Horizontal layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Day Info */}
                          <div className="bg-gradient-to-r from-pharaoh-gold/5 via-yellow-50 to-pharaoh-gold/5 rounded-xl border border-pharaoh-gold/20 p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-8 h-8 bg-pharaoh-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {parseInt(activeDay.split('-')[1])}
                              </div>
                              <div>
                                <h4 className="font-semibold text-pharaoh-gold">Day {parseInt(activeDay.split('-')[1])} Overview</h4>
                                <p className="text-sm text-gray-600">
                                  {days[activeDay]?.length || 0} activities planned
                                </p>
                              </div>
                            </div>

                            {days[activeDay] && days[activeDay].length > 0 ? (
                              <div className="space-y-2">
                                {days[activeDay].map((activity, index) => (
                                  <div key={index} className="flex items-center space-x-3 text-sm">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs border ${
                                      activity.type === 'comprehensive-plan'
                                        ? 'bg-purple-50 text-purple-600 border-purple-200'
                                        : activity.type === 'restaurant'
                                        ? 'bg-red-50 text-red-600 border-red-200'
                                        : 'bg-white text-pharaoh-gold border-pharaoh-gold/30'
                                    }`}>
                                      {activity.type === 'comprehensive-plan' ? '📋' : activity.type === 'restaurant' ? '🍽️' : index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-900">{activity.location}</span>
                                      <span className="text-gray-500 ml-2">• {activity.time}</span>
                                      {activity.type === 'comprehensive-plan' && (
                                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                          Full Day Plan
                                        </span>
                                      )}
                                      {activity.type === 'restaurant' && (
                                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                          {activity.title?.includes('Lunch') ? 'Lunch' : 'Dinner'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No activities planned for this day</p>
                            )}
                          </div>

                          {/* Map Controls and Tips */}
                          <div className="space-y-4">
                            {/* Quick Controls */}
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Map Controls</h4>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={handleToggleRoutes}
                                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    showRoutes
                                      ? 'bg-pharaoh-gold text-white'
                                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                  }`}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                  </svg>
                                  <span>Routes</span>
                                </button>

                                <button
                                  onClick={handleCenterMap}
                                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <span>Center</span>
                                </button>
                              </div>
                            </div>

                            {/* Map Tips */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-blue-700 mb-2">Map Tips</h4>
                                  <ul className="text-sm text-blue-600 space-y-1">
                                    <li>• Click markers for destination details</li>
                                    <li>• Switch day tabs to see different routes</li>
                                    <li>• Routes show suggested travel paths</li>
                                    <li>• Zoom and pan to explore the area</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
          {/* Map Toggle Button - Show when destinations are planned */}
          {hasPlannedDestinations && (
            <button
              onClick={() => setShowMap(!showMap)}
              className={`p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group ${
                showMap
                  ? 'bg-gradient-to-r from-pharaoh-gold to-yellow-500 text-white'
                  : 'bg-white text-pharaoh-gold border border-pharaoh-gold/20'
              }`}
              title={showMap ? 'Hide Map' : 'Show Map'}
            >
              <GlobeAltIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
          )}

          {/* Save Itinerary Button */}
          <button className="bg-gradient-to-r from-nile-blue to-pharaoh-gold text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
            </svg>
          </button>

          {/* Export Button */}
          <button className="bg-white text-nile-blue p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-gray-200 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </button>

          {/* Share Button */}
          <button className="bg-white text-pharaoh-gold p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-gray-200 group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
            </svg>
          </button>
        </div>

        {/* Progress Indicator */}
        {(extractedTripInfo.interests.length > 0 || extractedTripInfo.budget || extractedTripInfo.days) && (
          <div className="fixed top-6 right-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-40 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pharaoh-gold to-yellow-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Trip Planning Progress</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex space-x-1">
                    {[
                      extractedTripInfo.age,
                      extractedTripInfo.budget,
                      extractedTripInfo.days,
                      extractedTripInfo.interests.length > 0
                    ].map((completed, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {[extractedTripInfo.age, extractedTripInfo.budget, extractedTripInfo.days, extractedTripInfo.interests.length > 0].filter(Boolean).length}/4 complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
}

export default BasicChatItinerary;
