// Mock Gemini service for development

// Mock Gemini query response
export const mockGeminiQuery = async (queryData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { query, context } = queryData;

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
  } else if (query.toLowerCase().includes('luxor')) {
    response = `# Luxor Temple

Luxor Temple is a magnificent ancient Egyptian temple complex located on the east bank of the Nile River in the city of Luxor (ancient Thebes).

## Key Facts
- Built around 1400 BCE
- Dedicated primarily to the Theban Triad of Amun, Mut, and Khonsu
- Unlike other temples, it's not dedicated to a cult god or deified pharaoh
- Features impressive colonnades, statues, and reliefs

## Visiting Information
- **Hours**: 6:00 AM - 10:00 PM
- **Entrance Fee**: Adult: 160 EGP, Student: 80 EGP
- **Best Time to Visit**: Early morning or evening (when it's beautifully illuminated)

The temple is particularly magical at sunset and during the evening when it's illuminated. Consider visiting as part of a combined ticket with Karnak Temple.`;
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
  } else if (query.toLowerCase().includes('food') || query.toLowerCase().includes('eat') || query.toLowerCase().includes('restaurant')) {
    response = `# Egyptian Cuisine and Dining Recommendations

Egyptian cuisine is rich, flavorful, and has a history spanning thousands of years. Here are some must-try dishes and restaurant recommendations:

## Popular Egyptian Dishes
- **Koshari**: Egypt's national dish - a mix of rice, lentils, pasta, and tomato sauce
- **Ful Medames**: Mashed fava beans with olive oil, lemon juice, and spices
- **Molokhia**: A green soup made from jute leaves
- **Stuffed Pigeon (Hamam Mahshi)**: A delicacy in Egypt
- **Ta'ameya**: Egyptian falafel made with fava beans
- **Om Ali**: A delicious bread pudding dessert

## Top Restaurant Recommendations
1. **Abou El Sid** (Cairo): Authentic Egyptian cuisine in a traditional setting
2. **Koshary Abou Tarek** (Cairo): Famous for serving the best koshari in Egypt
3. **Sofra Restaurant** (Luxor): Set in a restored 1930s house with traditional decor
4. **Fish Market** (Cairo): Excellent seafood with Nile views
5. **El Dokka** (Luxor): Traditional Egyptian and Nubian cuisine

Would you like specific recommendations for a particular city or more details about any of these dishes?`;
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

  // If this is a plan generation request, include the plan data
  if (context && context.generatePlan) {
    // Special response for the plan generation request
    const planResponse = `# Your Personalized Egypt Itinerary

Based on our conversation, I've created a detailed itinerary for your trip to Egypt${context ? ` from ${context.startDate} to ${context.endDate}` : ''}.

## Itinerary Details
- **Title**: ${context.title || 'Egyptian Adventure'}
- **Description**: A personalized journey through the wonders of ancient Egypt
- **Budget**: ${context.budget || 'Moderate'}
- **Travel Style**: ${context.travelStyle || 'Couple'}

## Day 1: Cairo - Pyramids of Giza
- **Morning**: Visit the Pyramids of Giza and the Great Sphinx
- **Afternoon**: Explore the Solar Boat Museum
- **Evening**: Enjoy the Sound and Light Show at the pyramids
- **Accommodation**: Stay in Cairo

## Day 2: Cairo - Egyptian Museum & Islamic Cairo
- **Morning**: Visit the Egyptian Museum to see King Tutankhamun's treasures
- **Afternoon**: Explore Islamic Cairo and Khan el-Khalili bazaar
- **Evening**: Dinner cruise on the Nile
- **Accommodation**: Stay in Cairo

## Day 3: Luxor - East Bank
- **Morning**: Fly to Luxor
- **Afternoon**: Visit Karnak Temple and Luxor Temple
- **Evening**: Relax at your hotel
- **Accommodation**: Stay in Luxor

## Day 4: Luxor - West Bank
- **Morning**: Visit the Valley of the Kings
- **Afternoon**: Explore the Temple of Hatshepsut and the Colossi of Memnon
- **Evening**: Optional sound and light show at Karnak Temple
- **Accommodation**: Stay in Luxor

## Day 5: Aswan
- **Morning**: Travel to Aswan
- **Afternoon**: Visit the Philae Temple and the Unfinished Obelisk
- **Evening**: Explore a Nubian village
- **Accommodation**: Stay in Aswan

## Day 6: Abu Simbel
- **Morning**: Day trip to Abu Simbel temples
- **Afternoon**: Return to Aswan and visit the Aswan High Dam
- **Evening**: Felucca ride on the Nile
- **Accommodation**: Stay in Aswan

## Day 7: Return to Cairo
- **Morning**: Fly back to Cairo
- **Afternoon**: Visit Coptic Cairo
- **Evening**: Last-minute shopping and farewell dinner
- **Accommodation**: Stay in Cairo

## Travel Tips:
- Book domestic flights between Cairo, Luxor, and Aswan in advance
- Consider hiring a local guide for the historical sites
- Stay hydrated and wear sun protection
- Respect local customs and dress modestly, especially at religious sites

Would you like me to adjust any part of this itinerary?`;

    return {
      data: {
        response: planResponse,
        plan: planResponse
      }
    };
  }

  return {
    data: {
      response
    }
  };
};
