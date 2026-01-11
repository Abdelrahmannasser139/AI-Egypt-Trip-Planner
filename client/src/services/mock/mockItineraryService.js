// Mock itinerary service for development

// Mock generated itinerary data
export const mockGenerateItinerary = async (preferences) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract data from preferences
  const { startDate, endDate, destinations } = preferences;
  
  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  // Generate mock itinerary
  const itinerary = {};
  
  for (let i = 1; i <= numDays; i++) {
    const dayId = `day-${i}`;
    
    // Generate activities based on selected destinations
    const activities = [];
    
    if (destinations && destinations.length > 0) {
      // Morning activity
      if (i <= destinations.length) {
        activities.push({
          id: `activity-${dayId}-1`,
          type: 'sightseeing',
          title: `Visit ${destinations[i - 1]}`,
          description: `Explore the wonders of ${destinations[i - 1]}`,
          time: '09:00',
          duration: 180,
          location: { name: destinations[i - 1] }
        });
      } else {
        activities.push({
          id: `activity-${dayId}-1`,
          type: 'sightseeing',
          title: 'Free Morning',
          description: 'Enjoy a relaxing morning at your accommodation or explore the local area',
          time: '09:00',
          duration: 180,
          location: { name: 'Your accommodation' }
        });
      }
      
      // Lunch
      activities.push({
        id: `activity-${dayId}-2`,
        type: 'dining',
        title: 'Lunch',
        description: 'Enjoy a delicious Egyptian meal at a local restaurant',
        time: '13:00',
        duration: 90,
        location: { name: 'Local Restaurant' }
      });
      
      // Afternoon activity
      if (i <= destinations.length) {
        activities.push({
          id: `activity-${dayId}-3`,
          type: 'sightseeing',
          title: `Continue exploring ${destinations[i - 1]}`,
          description: `Discover more attractions in ${destinations[i - 1]}`,
          time: '15:00',
          duration: 180,
          location: { name: destinations[i - 1] }
        });
      } else {
        activities.push({
          id: `activity-${dayId}-3`,
          type: 'relaxation',
          title: 'Free Afternoon',
          description: 'Relax or explore at your own pace',
          time: '15:00',
          duration: 180,
          location: { name: 'Your choice' }
        });
      }
      
      // Dinner
      activities.push({
        id: `activity-${dayId}-4`,
        type: 'dining',
        title: 'Dinner',
        description: 'Enjoy traditional Egyptian cuisine',
        time: '19:00',
        duration: 120,
        location: { name: 'Restaurant' }
      });
    }
    
    itinerary[dayId] = activities;
  }
  
  return {
    data: {
      itinerary
    }
  };
};

// Mock create itinerary
export const mockCreateItinerary = async (itineraryData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a random ID
  const id = Math.floor(Math.random() * 10000);
  
  return {
    data: {
      id,
      ...itineraryData,
      createdAt: new Date().toISOString()
    }
  };
};

// Mock get destinations
export const mockGetDestinations = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: [
      {
        id: 1,
        name: 'Pyramids of Giza',
        region: 'Cairo & Giza',
        category: 'historical',
        shortDescription: 'Visit the last remaining wonder of the ancient world',
        coverImage: '/src/assets/destinations/pyramids.svg',
        averageRating: 4.8,
        reviewCount: 1245
      },
      {
        id: 2,
        name: 'Luxor Temple',
        region: 'Upper Egypt',
        category: 'historical',
        shortDescription: 'Explore the magnificent temple complex of ancient Thebes',
        coverImage: '/src/assets/destinations/luxor.svg',
        averageRating: 4.7,
        reviewCount: 987
      },
      {
        id: 3,
        name: 'Red Sea Coast',
        region: 'Red Sea',
        category: 'beach',
        shortDescription: 'Discover world-class diving and pristine beaches',
        coverImage: '/src/assets/destinations/red-sea.svg',
        averageRating: 4.6,
        reviewCount: 1532
      },
      {
        id: 4,
        name: 'Abu Simbel',
        region: 'Upper Egypt',
        category: 'historical',
        shortDescription: 'Marvel at the colossal temples of Ramses II',
        coverImage: '/src/assets/destinations/abu-simbel.svg',
        averageRating: 4.9,
        reviewCount: 756
      }
    ]
  };
};

// Mock Gemini chat response
export const mockGeminiQuery = async (queryData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { query } = queryData;
  
  // Generate a response based on the query
  let response = '';
  
  if (query.toLowerCase().includes('pyramid')) {
    response = `# The Pyramids of Giza

The Pyramids of Giza are the most iconic ancient structures in Egypt and the only surviving Wonder of the Ancient World. The complex includes:

- The Great Pyramid of Khufu
- The Pyramid of Khafre
- The Pyramid of Menkaure
- The Great Sphinx

## Visiting Information
- **Hours**: 8:00 AM - 5:00 PM (October to March), 8:00 AM - 7:00 PM (April to September)
- **Entrance Fee**: Adult: 240 EGP, Student: 120 EGP (additional fees for entering the pyramids)
- **Best Time to Visit**: Early morning or late afternoon to avoid crowds and heat

Would you like more specific information about the pyramids or tips for your visit?`;
  } else if (query.toLowerCase().includes('itinerary') || query.toLowerCase().includes('day')) {
    response = `# Recommended 7-Day Egypt Itinerary

Here's a perfect week-long itinerary for Egypt:

## Day 1-2: Cairo & Giza
- Visit the Pyramids of Giza and the Sphinx
- Explore the Egyptian Museum
- Wander through Islamic Cairo and Khan el-Khalili bazaar

## Day 3-4: Luxor
- Explore Karnak Temple and Luxor Temple
- Visit the Valley of the Kings and Queens
- See the Temple of Hatshepsut

## Day 5: Aswan
- Visit the Philae Temple
- See the Unfinished Obelisk
- Explore the Nubian Village

## Day 6: Abu Simbel
- Day trip to Abu Simbel temples

## Day 7: Return to Cairo
- Visit Coptic Cairo
- Last-minute shopping
- Optional: Sound and Light show at the pyramids

Would you like me to customize this itinerary based on your specific interests?`;
  } else {
    response = `Thank you for your question about Egypt! I'd be happy to help you plan your perfect Egyptian adventure.

Egypt offers a remarkable blend of ancient history, stunning landscapes, and rich culture. From the iconic pyramids to the beautiful beaches of the Red Sea, there's something for every traveler.

Could you tell me more about:
- How long you plan to stay in Egypt
- What types of attractions interest you most (historical sites, beaches, cultural experiences)
- Your preferred travel style (luxury, moderate, budget)
- Any specific places you definitely want to visit

With this information, I can provide more tailored recommendations for your trip!`;
  }
  
  return {
    data: {
      response
    }
  };
};
