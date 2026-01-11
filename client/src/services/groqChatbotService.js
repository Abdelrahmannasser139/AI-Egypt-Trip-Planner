// Groq-powered chatbot service for trip planning
import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Send a message to the Groq-powered chatbot
 * @param {Object} messageData - The message data
 * @param {string} messageData.message - The user message
 * @param {string} messageData.sessionId - The chat session ID
 * @param {Object} messageData.context - Additional context
 * @returns {Promise} Promise object that resolves to the chatbot response
 */
export const sendGroqChatMessage = async (messageData) => {
  try {
    console.log('Sending message to Groq chatbot:', messageData.message);
    
    const response = await axios.post(`${API_URL}/groq-chatbot/message`, {
      message: messageData.message,
      sessionId: messageData.sessionId || generateSessionId(),
      context: messageData.context || {}
    });

    console.log('Groq chatbot response:', response.data);

    return {
      success: true,
      data: {
        response: response.data.response,
        sessionId: response.data.sessionId,
        suggestions: response.data.suggestions || null,
        extractedInfo: response.data.extractedInfo || null,
        tripPlan: response.data.tripPlan || null,
        isItineraryPlanning: response.data.isItineraryPlanning || false,
        isComplete: response.data.isComplete || false
      }
    };
  } catch (error) {
    console.error('Error sending Groq chat message:', error);
    
    // Enhanced fallback responses when server is not available
    const fallbackResponse = generateFallbackResponse(messageData.message);
    
    return {
      success: true, // Return success with fallback
      data: {
        response: fallbackResponse.response,
        sessionId: messageData.sessionId || generateSessionId(),
        suggestions: fallbackResponse.suggestions || null,
        extractedInfo: fallbackResponse.extractedInfo || null,
        isItineraryPlanning: fallbackResponse.isItineraryPlanning || false,
        isComplete: false
      }
    };
  }
};

/**
 * Direct trip planning API call
 * @param {Object} tripData - Trip planning data
 * @returns {Promise} Promise object that resolves to the trip plan
 */
export const planTripDirect = async (tripData) => {
  try {
    const response = await axios.post(`${API_URL}/groq-chatbot/plan-trip`, tripData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in direct trip planning:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to plan trip'
    };
  }
};

/**
 * Test the Groq chatbot API connection
 * @returns {Promise} Promise object that resolves to test result
 */
export const testGroqChatbot = async () => {
  try {
    const response = await axios.get(`${API_URL}/groq-chatbot/test`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error testing Groq chatbot:', error);
    return {
      success: false,
      error: 'Groq chatbot API not available'
    };
  }
};

/**
 * Clear a chat session
 * @param {string} sessionId - The session ID to clear
 * @returns {Promise} Promise object that resolves to clear result
 */
export const clearChatSession = async (sessionId) => {
  try {
    const response = await axios.delete(`${API_URL}/groq-chatbot/session/${sessionId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error clearing chat session:', error);
    return {
      success: false,
      error: 'Failed to clear session'
    };
  }
};

/**
 * Generate a unique session ID for the chat
 * @returns {string} A unique session ID
 */
const generateSessionId = () => {
  return `groq_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate fallback responses when the server is not available
 * @param {string} message - The user message
 * @returns {Object} Fallback response object
 */
const generateFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Default response
  let response = "Hello! I'm Amira, your friendly Egypt travel assistant 🏺 I'm excited to help plan your Egyptian adventure!\nTell me about your dream trip - your age, budget, how many days, what interests you, and any cities you'd like to visit. Just describe it naturally!";
  let extractedInfo = null;
  let suggestions = null;
  let isItineraryPlanning = false;

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    response = "Hello! Wonderful to meet you! What's your age so I can plan the perfect Egyptian experience for you?";
    isItineraryPlanning = true;
  }
  else if (lowerMessage.includes('pyramid')) {
    response = "The pyramids are absolutely magnificent! How many days will you have to explore Egypt's wonders?";
    extractedInfo = {
      destinations: ['pyramids', 'giza'],
      interests: ['history'],
      duration: null,
      budget: null,
      travelStyle: null
    };
    isItineraryPlanning = true;
  }
  else if (lowerMessage.includes('luxor')) {
    response = "Luxor is incredible - the world's greatest open-air museum! What's your budget in EGP per day? (I can convert from USD/EUR)";
    extractedInfo = {
      destinations: ['luxor'],
      interests: ['history', 'culture'],
      duration: null,
      budget: null,
      travelStyle: null
    };
    isItineraryPlanning = true;
  }
  else if (lowerMessage.includes('plan') || lowerMessage.includes('trip') || lowerMessage.includes('itinerary')) {
    response = "Perfect! I love helping people discover Egypt's magic. Let's start - what's your age?";
    isItineraryPlanning = true;
  }
  else if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
    response = "Great question! How many days will you be exploring Egypt?";
    isItineraryPlanning = true;
  }
  else if (lowerMessage.includes('history') || lowerMessage.includes('ancient') || lowerMessage.includes('temple')) {
    response = "Egypt's history is absolutely fascinating - 5,000 years of wonders! What's your budget in EGP per day? (I can convert from USD/EUR)";
    extractedInfo = {
      destinations: [],
      interests: ['history', 'culture'],
      duration: null,
      budget: null,
      travelStyle: null
    };
    isItineraryPlanning = true;
  }
  else if (lowerMessage.includes('beach') || lowerMessage.includes('red sea')) {
    response = "The Red Sea is stunning - crystal clear waters and amazing coral reefs! How many days for your trip?";
    extractedInfo = {
      destinations: ['red sea'],
      interests: ['beaches', 'relaxation'],
      duration: null,
      budget: null,
      travelStyle: null
    };
    isItineraryPlanning = true;
  }
  
  return {
    response,
    extractedInfo,
    suggestions,
    isItineraryPlanning
  };
};

/**
 * Convert MongoDB trip plan suggestions to frontend format for drag-and-drop
 * @param {Object} suggestions - Suggestions from the backend
 * @returns {Array} Array of destinations compatible with existing UI
 */
export const convertSuggestionsToDestinations = (suggestions) => {
  if (!suggestions || !suggestions.destinations) {
    return [];
  }

  return suggestions.destinations.map(dest => ({
    id: dest.id,
    name: dest.name,
    region: dest.region,
    category: dest.category || 'historical',
    shortDescription: dest.shortDescription,
    coverImage: dest.coverImage,
    averageRating: dest.averageRating || 4.0,
    reviewCount: dest.reviewCount || 100,
    entryFee: dest.entryFee || { adult: '0 EGP' },
    visitDuration: dest.visitDuration || '2 hours',
    reason: dest.reason,
    priority: dest.priority,
    mongoData: dest.mongoData // Keep original MongoDB data
  }));
};

/**
 * Parse trip plan from AI response text and convert to itinerary format
 * @param {string} responseText - The AI response containing the trip plan
 * @returns {Object} Parsed itinerary with days and comprehensive plans
 */
export const parseTripPlanFromText = (responseText) => {
  const itinerary = {};

  try {
    console.log('Parsing trip plan from text:', responseText);

    // Enhanced patterns to handle comprehensive itinerary formats
    const patterns = [
      // Pattern 1: Comprehensive Day Plans with detailed content
      /📅\s*\*\*Day (\d+) - Comprehensive Plan:\*\*\s*\n\n([\s\S]*?)(?=📅\s*\*\*Day \d+|---|\n\n✨|$)/gi,
      // Pattern 2: **Day 1:** followed by destinations (basic format)
      /\*\*Day (\d+):\*\*\s*([^*]+?)(?=\*\*Day \d+:|$)/gi,
      // Pattern 3: Day 1: format (without asterisks)
      /Day (\d+):\s*([^D]+?)(?=Day \d+:|$)/gi,
      // Pattern 4: Look for destinations after "Your Itinerary Includes:"
      /Your Itinerary Includes:\*\*\s*([\s\S]*?)(?=\*\*|$)/gi
    ];

    let foundDays = false;

    // Try each pattern
    for (const pattern of patterns) {
      pattern.lastIndex = 0; // Reset regex
      let dayMatch;

      while ((dayMatch = pattern.exec(responseText)) !== null) {
        const dayNumber = parseInt(dayMatch[1]);
        const dayContent = dayMatch[2].trim();
        const dayId = `day-${dayNumber}`;

        console.log(`Found Day ${dayNumber} with content:`, dayContent);

        // Check if this is a comprehensive itinerary (first pattern)
        if (pattern === patterns[0]) {
          // Parse comprehensive itinerary content
          const comprehensiveData = parseComprehensiveItinerary(dayContent, dayNumber);
          if (comprehensiveData.activities.length > 0) {
            itinerary[dayId] = {
              activities: comprehensiveData.activities,
              comprehensiveText: dayContent,
              isComprehensive: true
            };
            foundDays = true;
            console.log(`Added comprehensive plan for ${dayId} with ${comprehensiveData.activities.length} activities`);
          }
        } else {
          // Extract activities from basic day content
          const activities = parseActivitiesFromDayContent(dayContent, dayNumber);
          if (activities.length > 0) {
            itinerary[dayId] = {
              activities: activities,
              isComprehensive: false
            };
            foundDays = true;
            console.log(`Added ${activities.length} activities to ${dayId}`);
          }
        }
      }

      if (foundDays) break; // Stop if we found days with this pattern
    }

    // Special handling for the format you showed: "Day 1: dest1, dest2"
    if (!foundDays) {
      console.log('Trying alternative parsing for comma-separated format');
      const dayLinePattern = /\*\*Day (\d+):\*\*\s*([^\n*]+)/gi;
      let dayMatch;

      while ((dayMatch = dayLinePattern.exec(responseText)) !== null) {
        const dayNumber = parseInt(dayMatch[1]);
        const dayContent = dayMatch[2].trim();
        const dayId = `day-${dayNumber}`;

        console.log(`Found Day ${dayNumber} with destinations:`, dayContent);

        // Split by comma and create activities
        const destinations = dayContent.split(',').map(dest => dest.trim()).filter(dest => dest.length > 3);
        const activities = [];

        destinations.forEach((destination, index) => {
          const activity = parseActivityText(destination, index);
          if (activity) {
            activities.push(activity);
          }
        });

        if (activities.length > 0) {
          itinerary[dayId] = {
            activities: activities,
            isComprehensive: false
          };
          foundDays = true;
          console.log(`Added ${activities.length} activities to ${dayId}`);
        }
      }
    }

    console.log('Final parsed itinerary:', itinerary);
    return itinerary;
  } catch (error) {
    console.error('Error parsing trip plan:', error);
    return {};
  }
};

/**
 * Parse comprehensive itinerary content and extract activities
 * @param {string} comprehensiveContent - The comprehensive day content
 * @param {number} dayNumber - The day number
 * @returns {Object} Object with activities array and metadata
 */
const parseComprehensiveItinerary = (comprehensiveContent, dayNumber) => {
  const activities = [];

  // Enhanced patterns for comprehensive itinerary parsing
  const timeActivityPatterns = [
    // Pattern 1: **8:00 AM - Activity Name**
    /\*\*(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*([^*\n]+)\*\*/gi,
    // Pattern 2: **Time - Activity**
    /\*\*([^*-]+?)\s*-\s*([^*\n]+)\*\*/gi,
    // Pattern 3: Time: Activity
    /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[-:]\s*([^\n]+)/gi
  ];

  let activityIndex = 0;

  for (const pattern of timeActivityPatterns) {
    pattern.lastIndex = 0;
    let match;
    const tempActivities = [];

    while ((match = pattern.exec(comprehensiveContent)) !== null) {
      const timeStr = match[1].trim();
      const activityTitle = match[2].trim();

      // Skip if it's not a valid activity
      if (activityTitle.length < 3 || activityTitle.toLowerCase().includes('day ')) {
        continue;
      }

      // Extract location from the activity title
      let location = '';
      const locationMatch = activityTitle.match(/at\s+([^,\n]+)/i);
      if (locationMatch) {
        location = locationMatch[1].trim();
      }

      // Determine activity type
      const isRestaurant = /breakfast|lunch|dinner|meal|restaurant|café|cafe/i.test(activityTitle);

      // Create activity object
      const activity = {
        id: `comprehensive-${dayNumber}-${activityIndex++}`,
        title: activityTitle,
        description: extractDescriptionFromContext(comprehensiveContent, activityTitle),
        time: normalizeTime(timeStr),
        location: location || extractLocationFromTitle(activityTitle),
        type: isRestaurant ? 'restaurant' : 'site',
        source: 'ai-comprehensive',
        isComprehensive: true
      };

      tempActivities.push(activity);
    }

    // Use the pattern that found the most activities
    if (tempActivities.length > activities.length) {
      activities.length = 0;
      activities.push(...tempActivities);
    }

    if (activities.length > 0) break; // Stop if we found activities
  }

  // If no time-based activities found, try to extract general activities
  if (activities.length === 0) {
    const generalActivities = parseActivitiesFromDayContent(comprehensiveContent, dayNumber);
    activities.push(...generalActivities.map(activity => ({
      ...activity,
      isComprehensive: true,
      source: 'ai-comprehensive'
    })));
  }

  return {
    activities,
    hasTimeSchedule: activities.some(a => a.time && a.time !== '09:00'),
    comprehensiveText: comprehensiveContent
  };
};

/**
 * Extract description from comprehensive content context
 * @param {string} fullContent - The full comprehensive content
 * @param {string} activityTitle - The activity title to find context for
 * @returns {string} Extracted description
 */
const extractDescriptionFromContext = (fullContent, activityTitle) => {
  // Look for content after the activity title
  const titleIndex = fullContent.indexOf(activityTitle);
  if (titleIndex === -1) return activityTitle;

  const afterTitle = fullContent.substring(titleIndex + activityTitle.length);
  const nextActivityMatch = afterTitle.match(/\*\*\d{1,2}:\d{2}/);
  const contextEnd = nextActivityMatch ? nextActivityMatch.index : Math.min(200, afterTitle.length);

  let description = afterTitle.substring(0, contextEnd).trim();

  // Clean up the description
  description = description
    .replace(/^\*\*|\*\*$/g, '') // Remove markdown
    .replace(/^[:\-\s]+/, '') // Remove leading punctuation
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  return description || activityTitle;
};

/**
 * Normalize time format to HH:MM
 * @param {string} timeStr - Time string to normalize
 * @returns {string} Normalized time in HH:MM format
 */
const normalizeTime = (timeStr) => {
  if (!timeStr) return '09:00';

  // Handle AM/PM format
  const ampmMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1]);
    const minutes = ampmMatch[2] ? parseInt(ampmMatch[2]) : 0;
    const period = ampmMatch[3].toUpperCase();

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  // Handle 24-hour format
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  return '09:00'; // Default fallback
};

/**
 * Extract location from activity title
 * @param {string} title - Activity title
 * @returns {string} Extracted location
 */
const extractLocationFromTitle = (title) => {
  // Common location patterns
  const patterns = [
    /visit\s+([^,\n]+)/i,
    /explore\s+([^,\n]+)/i,
    /at\s+([^,\n]+)/i,
    /to\s+([^,\n]+)/i
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  // If no pattern matches, try to extract proper nouns
  const properNounMatch = title.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  return properNounMatch ? properNounMatch[1] : 'Egypt';
};

/**
 * Parse activities from a day's content
 * @param {string} dayContent - The content for a specific day
 * @param {number} dayNumber - The day number
 * @returns {Array} Array of activity objects
 */
const parseActivitiesFromDayContent = (dayContent, dayNumber) => {
  const activities = [];

  // Multiple activity extraction patterns
  const activityPatterns = [
    // Pattern 1: Comma-separated destinations
    /([^,\n]+)/g,
    // Pattern 2: Bullet points with asterisks
    /\*\s*([^*\n]+)/g,
    // Pattern 3: Bullet points with dashes
    /-\s*([^-\n]+)/g
  ];

  for (const pattern of activityPatterns) {
    pattern.lastIndex = 0;
    let activityMatch;
    const tempActivities = [];

    while ((activityMatch = pattern.exec(dayContent)) !== null) {
      const activityText = activityMatch[1].trim();

      // Skip empty activities, day headers, or very short text
      if (activityText &&
          !activityText.toLowerCase().includes('day ') &&
          activityText.length > 3 &&
          !activityText.includes('**') &&
          !activityText.toLowerCase().includes('budget') &&
          !activityText.toLowerCase().includes('total') &&
          !activityText.toLowerCase().includes('remaining')) {

        const activity = parseActivityText(activityText, tempActivities.length);
        if (activity) {
          tempActivities.push(activity);
        }
      }
    }

    // Use the pattern that found the most activities
    if (tempActivities.length > activities.length) {
      activities.length = 0; // Clear previous
      activities.push(...tempActivities);
    }

    if (activities.length > 0) break; // Stop if we found activities
  }

  return activities;
};

/**
 * Parse individual activity text and create activity object
 * @param {string} activityText - The activity description text
 * @param {number} index - The activity index for time calculation
 * @returns {Object} Activity object
 */
const parseActivityText = (activityText, index) => {
  try {
    // Determine if this is a restaurant or site
    const isRestaurant = activityText.toLowerCase().includes('lunch') ||
                        activityText.toLowerCase().includes('dinner') ||
                        activityText.toLowerCase().includes('restaurant') ||
                        activityText.toLowerCase().includes('café') ||
                        activityText.toLowerCase().includes('cafe');

    // Common location patterns to extract
    const locationPatterns = [
      /(?:lunch|dinner)\s+at\s+([^,\(\)\n]+)/i,
      /visit\s+([^,\(\)]+)/i,
      /explore\s+([^,\(\)]+)/i,
      /go\s+to\s+([^,\(\)]+)/i,
      /at\s+([^,\(\)]+)/i,
      /in\s+([^,\(\)]+)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Temple|Museum|Park|Beach|Oasis|Pyramid|Palace|Monastery|Market|Bay|Island|Desert|National\s+Park|Restaurant|Café)))/i
    ];

    let location = '';
    let description = activityText;

    // Try to extract location
    for (const pattern of locationPatterns) {
      const match = activityText.match(pattern);
      if (match) {
        location = match[1].trim();
        break;
      }
    }

    // If no specific location found, try to extract from common Egyptian destinations
    if (!location) {
      const egyptianDestinations = [
        'Pyramids of Giza', 'Sphinx', 'Karnak Temple', 'Luxor Temple', 'Valley of the Kings',
        'Abu Simbel', 'Philae Temple', 'Aswan High Dam', 'Nubian Village', 'Khan El Khalili',
        'Egyptian Museum', 'Citadel of Saladin', 'Al-Azhar Mosque', 'Coptic Cairo',
        'Sharm El Sheikh', 'Hurghada', 'Dahab', 'Ras Mohammed', 'White Desert',
        'Siwa Oasis', 'Alexandria', 'Montaza Palace', 'Library of Alexandria',
        // Additional destinations from your example
        'The Hidden Sun Temple of Abu Ghurab', 'The Stone Quarries of Tura', 'Shark\'s Bay',
        'Sharm El Sheikh Beaches', 'The Monastery of Abu Makar', 'The Cave Monastery of Wadi El-Natrun',
        'Naama Bay', 'Mangarove Beach', 'Temple of Ptah', 'The Temple of Ptah'
      ];

      for (const dest of egyptianDestinations) {
        if (activityText.toLowerCase().includes(dest.toLowerCase())) {
          location = dest;
          break;
        }
      }
    }

    // If still no location, use the entire text as location (for unique destinations)
    if (!location && activityText.length > 5) {
      // Clean up the text to use as location
      location = activityText
        .replace(/^(visit|explore|go to|at|in)\s+/i, '')
        .replace(/\s*\([^)]*\)/, '') // Remove parentheses content
        .trim();
    }

    // Calculate time based on activity type and index
    let time = '09:00';
    let title = '';

    if (isRestaurant) {
      if (activityText.toLowerCase().includes('lunch')) {
        time = '13:00';
        title = `Lunch at ${location}`;
      } else if (activityText.toLowerCase().includes('dinner')) {
        time = '19:00';
        title = `Dinner at ${location}`;
      } else {
        time = '12:00'; // Default restaurant time
        title = `Meal at ${location}`;
      }
    } else {
      // Sites: 9 AM, 3 PM pattern
      const siteIndex = Math.floor(index / 2); // Every 2 activities (site + restaurant)
      const isSecondSite = index % 4 >= 2; // Second site of the day
      time = isSecondSite ? '15:00' : '09:00';
      title = location ? `Visit ${location}` : description.substring(0, 50);
    }

    // Clean up description
    description = activityText
      .replace(/^\*\s*/, '') // Remove leading asterisk
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return {
      id: `ai-activity-${Date.now()}-${index}`,
      title: title,
      description: description,
      time: time,
      location: location || 'Egypt',
      type: isRestaurant ? 'restaurant' : 'site',
      source: 'ai-generated'
    };
  } catch (error) {
    console.error('Error parsing activity text:', error);
    return null;
  }
};

/**
 * Enhanced extraction function with better natural language processing
 * @param {string} message - The user message
 * @returns {Object} Extracted trip information
 */
const extractTripInfoAdvanced = (message) => {
  const lowerMessage = message.toLowerCase();
  const extractedInfo = {};

  // Extract age - more patterns
  const ageMatch = message.match(/(?:i'm|i am|age|aged?|my age is)\s*(\d{1,2})/i) ||
                   message.match(/(\d{1,2})\s*(?:years?\s*old|yo|y\.o\.|year old)/i) ||
                   message.match(/(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[\s-]?(?:one|two|three|four|five|six|seven|eight|nine)?/i);
  if (ageMatch) {
    let age;
    if (ageMatch[1]) {
      age = parseInt(ageMatch[1]);
    } else {
      // Handle written numbers
      const ageText = ageMatch[0].toLowerCase();
      const ageMap = {
        'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
        'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23, 'twenty-four': 24, 'twenty-five': 25,
        'twenty-six': 26, 'twenty-seven': 27, 'twenty-eight': 28, 'twenty-nine': 29
      };
      age = ageMap[ageText.replace(/\s/g, '-')];
    }
    if (age >= 5 && age <= 100) {
      extractedInfo.age = age;
    }
  }

  // Extract budget - more patterns including currency conversion
  // First check for USD/EUR and convert to EGP
  const usdMatch = message.match(/\$(\d+(?:,\d{3})*)|(\d+(?:,\d{3})*)\s*(?:usd|dollars?)/i);
  const eurMatch = message.match(/€(\d+(?:,\d{3})*)|(\d+(?:,\d{3})*)\s*(?:eur|euros?)/i);

  let budget = null;
  let conversionNote = '';

  if (usdMatch) {
    const usdAmount = parseInt((usdMatch[1] || usdMatch[2]).replace(/,/g, ''));
    budget = usdAmount * 50; // 1 USD = 50 EGP
    conversionNote = ` (converted from $${usdAmount})`;
  } else if (eurMatch) {
    const eurAmount = parseInt((eurMatch[1] || eurMatch[2]).replace(/,/g, ''));
    budget = eurAmount * 58; // 1 EUR = 58 EGP
    conversionNote = ` (converted from €${eurAmount})`;
  } else {
    // Check for EGP amounts
    const budgetMatch = message.match(/(\d+(?:,\d{3})*)\s*(?:egp|egyptian pounds?|per day|daily|budget|each day)/i) ||
                        message.match(/budget.*?(\d+(?:,\d{3})*)/i) ||
                        message.match(/around\s*(\d+(?:,\d{3})*)/i) ||
                        message.match(/about\s*(\d+(?:,\d{3})*)/i) ||
                        message.match(/(\d+(?:,\d{3})*)\s*(?:a day|per day)/i);
    if (budgetMatch) {
      budget = parseInt(budgetMatch[1].replace(/,/g, ''));
    }
  }

  if (budget && budget >= 100) {
    extractedInfo.budget = budget;
    if (conversionNote) {
      extractedInfo.conversionNote = conversionNote;
    }
  }

  // Extract days - more patterns
  const daysMatch = message.match(/(\d+)\s*(?:days?|day trip)/i) ||
                    message.match(/(?:for|about|around)\s*(\d+)\s*days?/i) ||
                    message.match(/(\d+)[\s-]?day/i) ||
                    message.match(/(?:week|7 days)/i) ||
                    message.match(/(?:two weeks|14 days)/i);
  if (daysMatch) {
    let days;
    if (daysMatch[1]) {
      days = parseInt(daysMatch[1]);
    } else if (daysMatch[0].includes('week')) {
      days = daysMatch[0].includes('two') ? 14 : 7;
    }
    if (days >= 1 && days <= 30) {
      extractedInfo.days = days;
    }
  }

  // Extract interests - more comprehensive
  const interests = [];
  if (lowerMessage.includes('history') || lowerMessage.includes('historical') || lowerMessage.includes('ancient') ||
      lowerMessage.includes('pyramid') || lowerMessage.includes('temple') || lowerMessage.includes('pharaoh')) {
    interests.push('history');
  }
  if (lowerMessage.includes('beach') || lowerMessage.includes('sea') || lowerMessage.includes('swimming') ||
      lowerMessage.includes('diving') || lowerMessage.includes('snorkeling') || lowerMessage.includes('red sea')) {
    interests.push('beaches');
  }
  if (lowerMessage.includes('culture') || lowerMessage.includes('cultural') || lowerMessage.includes('tradition') ||
      lowerMessage.includes('museum') || lowerMessage.includes('local life') || lowerMessage.includes('authentic')) {
    interests.push('culture');
  }
  if (lowerMessage.includes('adventure') || lowerMessage.includes('exciting') || lowerMessage.includes('thrill') ||
      lowerMessage.includes('safari') || lowerMessage.includes('desert') || lowerMessage.includes('camel')) {
    interests.push('adventure');
  }
  if (interests.length > 0) {
    extractedInfo.interests = [...new Set(interests)]; // Remove duplicates
  }

  // Extract cities - more patterns
  const cities = [];
  if (lowerMessage.includes('cairo') || lowerMessage.includes('giza')) cities.push('Cairo');
  if (lowerMessage.includes('luxor')) cities.push('Luxor');
  if (lowerMessage.includes('aswan')) cities.push('Aswan');
  if (lowerMessage.includes('hurghada')) cities.push('Hurghada');
  if (lowerMessage.includes('sharm') || lowerMessage.includes('sharm el sheikh')) cities.push('Sharm El Sheikh');
  if (lowerMessage.includes('alexandria')) cities.push('Alexandria');
  if (lowerMessage.includes('dahab')) cities.push('Dahab');
  if (lowerMessage.includes('marsa alam')) cities.push('Marsa Alam');
  if (cities.length > 0) {
    extractedInfo.cities = [...new Set(cities)]; // Remove duplicates
  }

  return extractedInfo;
};

/**
 * Enhanced fallback with better trip plan generation and review step
 * @param {string} message - The user message
 * @param {Object} extractedInfo - Previously extracted trip information
 * @returns {Object} Enhanced fallback response with trip plan
 */
export const generateEnhancedFallback = (message, extractedInfo = {}) => {
  const lowerMessage = message.toLowerCase();

  // Extract information from current message
  const newlyExtracted = extractTripInfoAdvanced(message);
  let newExtractedInfo = { ...extractedInfo, ...newlyExtracted };

  // Check if user is confirming/correcting information
  const isConfirming = lowerMessage.includes('yes') || lowerMessage.includes('correct') || lowerMessage.includes('right');
  const isRejecting = lowerMessage.includes('no') || lowerMessage.includes('wrong') || lowerMessage.includes('incorrect');

  // If we have some info but not complete, show review step
  const hasPartialInfo = Object.keys(newExtractedInfo).length > 0;
  const isComplete = newExtractedInfo.age && newExtractedInfo.budget && newExtractedInfo.days && newExtractedInfo.interests?.length > 0;

  if (hasPartialInfo && !isComplete && !isConfirming && !isRejecting) {
    // Show what we extracted and ask for missing info
    let reviewText = "Great! Let me confirm what I understood:\n\n";

    if (newExtractedInfo.age) reviewText += `✅ Age: ${newExtractedInfo.age} years old\n`;
    if (newExtractedInfo.budget) {
      const conversionNote = newExtractedInfo.conversionNote || '';
      reviewText += `✅ Budget: ${newExtractedInfo.budget} EGP per day${conversionNote}\n`;
    }
    if (newExtractedInfo.days) reviewText += `✅ Duration: ${newExtractedInfo.days} days\n`;
    if (newExtractedInfo.interests?.length > 0) reviewText += `✅ Interests: ${newExtractedInfo.interests.join(', ')}\n`;
    if (newExtractedInfo.cities?.length > 0) reviewText += `✅ Cities: ${newExtractedInfo.cities.join(', ')}\n`;
    else reviewText += `✅ Cities: I'll recommend the best ones for your interests\n`;

    reviewText += "\nIs this correct? ";

    // Ask for missing information
    const missing = [];
    if (!newExtractedInfo.age) missing.push("your age");
    if (!newExtractedInfo.budget) missing.push("your budget in EGP per day (I can convert from USD/EUR)");
    if (!newExtractedInfo.days) missing.push("how many days");
    if (!newExtractedInfo.interests || newExtractedInfo.interests.length === 0) missing.push("what interests you (history, beaches, culture, adventure)");

    if (missing.length > 0) {
      reviewText += `And I still need: ${missing.join(', ')}.`;
    }

    return {
      response: reviewText,
      extractedInfo: newExtractedInfo,
      isItineraryPlanning: true,
      isComplete: false
    };
  }

  if (isComplete) {
    const tripPlan = generateSampleTripPlan(newExtractedInfo);
    return {
      response: tripPlan.response,
      extractedInfo: newExtractedInfo,
      tripPlan: tripPlan.itinerary,
      isItineraryPlanning: true,
      isComplete: true
    };
  }

  // Ask for missing information with friendly questions
  if (!newExtractedInfo.age) {
    return { response: "Great! What's your age so I can suggest the perfect activities for you?", extractedInfo: newExtractedInfo, isItineraryPlanning: true };
  }
  if (!newExtractedInfo.budget) {
    return { response: "Perfect! What's your budget in EGP per day? (I can convert from USD/EUR - just mention $100 or €100). This helps me find the best experiences within your range.", extractedInfo: newExtractedInfo, isItineraryPlanning: true };
  }
  if (!newExtractedInfo.days) {
    return { response: "Wonderful! How many days will you have to explore Egypt?", extractedInfo: newExtractedInfo, isItineraryPlanning: true };
  }
  if (!newExtractedInfo.interests || newExtractedInfo.interests.length === 0) {
    return { response: "Excellent! What interests you most? Egypt offers incredible history, beautiful beaches, rich culture, and amazing adventures!", extractedInfo: newExtractedInfo, isItineraryPlanning: true };
  }

  // Regular fallback response
  return generateFallbackResponse(message);
};

/**
 * Generate a sample trip plan based on extracted information
 * @param {Object} info - Extracted trip information
 * @returns {Object} Generated trip plan
 */
const generateSampleTripPlan = (info) => {
  const { age, budget, days, interests } = info;

  let response = `Perfect! Here's your ${days}-day Egypt plan:\n\n`;
  const itinerary = {};

  // Sample sites and their nearby restaurants
  const siteRestaurantPairs = {
    history: [
      {
        sites: ['Pyramids of Giza', 'Sphinx'],
        lunch: 'Panorama Pyramids Restaurant',
        dinner: 'Khufu Restaurant'
      },
      {
        sites: ['Egyptian Museum', 'Tahrir Square'],
        lunch: 'Café Riche',
        dinner: 'Abou El Sid'
      },
      {
        sites: ['Karnak Temple', 'Luxor Temple'],
        lunch: 'Sofra Restaurant',
        dinner: '1886 Restaurant'
      },
      {
        sites: ['Valley of the Kings', 'Hatshepsut Temple'],
        lunch: 'Marsam Restaurant',
        dinner: 'Al-Sahaby Lane Restaurant'
      },
      {
        sites: ['Khan El Khalili', 'Al-Azhar Mosque'],
        lunch: 'Naguib Mahfouz Café',
        dinner: 'Zitouni Restaurant'
      }
    ],
    beaches: [
      {
        sites: ['Ras Mohammed National Park', 'Shark Bay'],
        lunch: 'Fares Seafood',
        dinner: 'Il Vizietto'
      },
      {
        sites: ['Naama Bay Beach', 'SOHO Square'],
        lunch: 'Hard Rock Café',
        dinner: 'Pomodoro Restaurant'
      },
      {
        sites: ['Blue Hole Dahab', 'Laguna Beach'],
        lunch: 'Ali Baba Restaurant',
        dinner: 'Shark Restaurant'
      },
      {
        sites: ['Hurghada Marina', 'Giftun Island'],
        lunch: 'Moby Dick Restaurant',
        dinner: 'The Lodge Restaurant'
      }
    ],
    culture: [
      {
        sites: ['Coptic Cairo', 'Hanging Church'],
        lunch: 'Abou Tarek',
        dinner: 'Sequoia'
      },
      {
        sites: ['Islamic Cairo', 'Citadel of Saladin'],
        lunch: 'Khan El Khalili Restaurant',
        dinner: 'Bab Al Qasr'
      }
    ]
  };

  // Select site-restaurant pairs based on interests
  let selectedPairs = [];
  if (interests.includes('history')) {
    selectedPairs.push(...siteRestaurantPairs.history);
  }
  if (interests.includes('beaches') || interests.includes('swimming')) {
    selectedPairs.push(...siteRestaurantPairs.beaches);
  }
  if (interests.includes('culture')) {
    selectedPairs.push(...siteRestaurantPairs.culture);
  }

  // If no specific interests, use history as default
  if (selectedPairs.length === 0) {
    selectedPairs = siteRestaurantPairs.history;
  }

  // Distribute pairs across days (1 pair per day = 2 sites + 2 restaurants)
  for (let day = 1; day <= days; day++) {
    const dayId = `day-${day}`;
    const pairIndex = (day - 1) % selectedPairs.length;
    const dayPair = selectedPairs[pairIndex];

    response += `**Day ${day}:** ${dayPair.sites.join(', ')}\n`;
    const activities = [];

    // Add first site (morning)
    const site1Activity = {
      id: `ai-site1-${Date.now()}-${day}`,
      title: `Visit ${dayPair.sites[0]}`,
      description: `Explore ${dayPair.sites[0]}`,
      time: '09:00',
      location: dayPair.sites[0],
      type: 'site',
      source: 'ai-generated'
    };
    activities.push(site1Activity);

    // Add lunch
    const lunchActivity = {
      id: `ai-lunch-${Date.now()}-${day}`,
      title: `Lunch at ${dayPair.lunch}`,
      description: `Enjoy lunch at ${dayPair.lunch}`,
      time: '13:00',
      location: dayPair.lunch,
      type: 'restaurant',
      source: 'ai-generated'
    };
    activities.push(lunchActivity);

    // Add second site (afternoon)
    const site2Activity = {
      id: `ai-site2-${Date.now()}-${day}`,
      title: `Visit ${dayPair.sites[1]}`,
      description: `Explore ${dayPair.sites[1]}`,
      time: '15:00',
      location: dayPair.sites[1],
      type: 'site',
      source: 'ai-generated'
    };
    activities.push(site2Activity);

    // Add dinner
    const dinnerActivity = {
      id: `ai-dinner-${Date.now()}-${day}`,
      title: `Dinner at ${dayPair.dinner}`,
      description: `Enjoy dinner at ${dayPair.dinner}`,
      time: '19:00',
      location: dayPair.dinner,
      type: 'restaurant',
      source: 'ai-generated'
    };
    activities.push(dinnerActivity);

    itinerary[dayId] = activities;
  }

  response += `✅ Plan created! Budget: ${budget} EGP. Check your day tabs above!`;

  return {
    response,
    itinerary
  };
};

export default {
  sendGroqChatMessage,
  planTripDirect,
  testGroqChatbot,
  clearChatSession,
  convertSuggestionsToDestinations,
  parseTripPlanFromText,
  generateEnhancedFallback
};
