import {
  Site,
  Restaurant,
  generateEmbedding,
  getTopSimilarRecords,
  selectClosestSitePair,
  haversineDistance,
  getMidpoint,
  generateComprehensiveItinerary
} from './groqTripPlannerService.js';

// Get restaurants by distance
export const getRestaurantsByDistance = async (collection, city = null, budgetConstraint = null, limit = 10) => {
  let query = {};
  if (city) query.city = city;
  if (budgetConstraint !== null) query.average_budget_egp = { $lte: budgetConstraint };

  const restaurants = await collection.find(query).lean();
  return restaurants.filter(r => r.latitude && r.longitude).slice(0, limit);
};

// Get Day 1 sites (always Pyramids + Egyptian Museum)
const getDay1Sites = async (budget) => {
  console.log(`🏛️ Getting Day 1 mandatory sites: Pyramids + Egyptian Museum`);

  try {
    // Try to get actual sites from database
    const pyramids = await Site.findOne({
      $or: [
        { name: { $regex: /pyramid/i } },
        { name: { $regex: /giza/i } }
      ]
    }).lean();

    const museum = await Site.findOne({
      $or: [
        { name: { $regex: /egyptian museum/i } },
        { name: { $regex: /museum/i } }
      ]
    }).lean();

    const sites = [];

    // Add Pyramids (real or fallback)
    if (pyramids) {
      sites.push({
        ...pyramids,
        cost_egp: Math.min(pyramids.budget || 200, budget * 0.6)
      });
    } else {
      sites.push({
        name: 'Pyramids of Giza',
        city: 'Giza',
        governorate: 'Giza',
        description: 'The last surviving wonder of the ancient world, these magnificent pyramids have stood for over 4,500 years.',
        similarity_score: 1.0,
        activities: ['Exploring', 'Photography', 'Camel Riding'],
        opening_time: '08:00',
        closing_time: '17:00',
        average_time_spent_hours: 3,
        cost_egp: Math.min(200, budget * 0.6),
        latitude: 29.9792,
        longitude: 31.1342
      });
    }

    // Add Egyptian Museum (real or fallback)
    if (museum) {
      sites.push({
        ...museum,
        cost_egp: Math.min(museum.budget || 100, budget * 0.4)
      });
    } else {
      sites.push({
        name: 'Egyptian Museum',
        city: 'Cairo',
        governorate: 'Cairo',
        description: 'Home to the world\'s most extensive collection of ancient Egyptian artifacts, including treasures from Tutankhamun\'s tomb.',
        similarity_score: 1.0,
        activities: ['Museum Tour', 'Photography', 'Learning'],
        opening_time: '09:00',
        closing_time: '17:00',
        average_time_spent_hours: 2.5,
        cost_egp: Math.min(100, budget * 0.4),
        latitude: 30.0478,
        longitude: 31.2336
      });
    }

    console.log(`✅ Day 1 sites prepared: ${sites.map(s => s.name).join(' + ')}`);
    return sites;

  } catch (error) {
    console.error('Error getting Day 1 sites:', error);
    // Return fallback sites
    return [
      {
        name: 'Pyramids of Giza',
        city: 'Giza',
        governorate: 'Giza',
        description: 'The last surviving wonder of the ancient world.',
        similarity_score: 1.0,
        activities: ['Exploring', 'Photography'],
        opening_time: '08:00',
        closing_time: '17:00',
        average_time_spent_hours: 3,
        cost_egp: budget * 0.6,
        latitude: 29.9792,
        longitude: 31.1342
      },
      {
        name: 'Egyptian Museum',
        city: 'Cairo',
        governorate: 'Cairo',
        description: 'World\'s most extensive collection of ancient Egyptian artifacts.',
        similarity_score: 1.0,
        activities: ['Museum Tour', 'Learning'],
        opening_time: '09:00',
        closing_time: '17:00',
        average_time_spent_hours: 2.5,
        cost_egp: budget * 0.4,
        latitude: 30.0478,
        longitude: 31.2336
      }
    ];
  }
};

// Select sites by governorate to ensure they're in the same region
const selectSitesByGovernorate = (sites, usedSites = new Set()) => {
  console.log(`🗺️ Grouping sites by governorate for same-day visits`);

  const availableSites = sites.filter(site => !usedSites.has(site.name));
  if (availableSites.length === 0) return [];

  // Group sites by governorate/city
  const sitesByGovernorate = {};
  availableSites.forEach(site => {
    const gov = site.governorate || site.city || 'Unknown';
    if (!sitesByGovernorate[gov]) {
      sitesByGovernorate[gov] = [];
    }
    sitesByGovernorate[gov].push(site);
  });

  console.log(`📍 Sites grouped by governorate:`, Object.keys(sitesByGovernorate).map(gov =>
    `${gov}: ${sitesByGovernorate[gov].length} sites`
  ).join(', '));

  // Find the governorate with the most high-scoring sites
  let bestGovernorate = null;
  let bestScore = 0;

  Object.keys(sitesByGovernorate).forEach(gov => {
    const govSites = sitesByGovernorate[gov];
    if (govSites.length >= 2) { // Need at least 2 sites for a day
      const avgScore = govSites.reduce((sum, site) => sum + (site.similarity_score || 0), 0) / govSites.length;
      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestGovernorate = gov;
      }
    }
  });

  // If no governorate has 2+ sites, pick the best single site + closest one
  if (!bestGovernorate) {
    console.log(`⚠️ No governorate has 2+ sites, selecting best individual sites`);
    const sortedSites = availableSites.sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0));
    return sortedSites.slice(0, 2);
  }

  console.log(`🎯 Selected governorate: ${bestGovernorate} (score: ${bestScore.toFixed(2)})`);

  // Return top 2 sites from the best governorate
  const selectedGovSites = sitesByGovernorate[bestGovernorate]
    .sort((a, b) => (b.similarity_score || 0) - (a.similarity_score || 0))
    .slice(0, 2);

  console.log(`✅ Selected sites: ${selectedGovSites.map(s => `${s.name} (${s.city})`).join(', ')}`);
  return selectedGovSites;
};

// Get fallback sites for when RAG fails
const getFallbackSites = async (dayNumber, budget) => {
  console.log(`🔄 Getting fallback sites for day ${dayNumber + 1}`);

  const fallbackSitesByDay = [
    // Day 2: Luxor sites
    [
      { name: 'Karnak Temple', city: 'Luxor', governorate: 'Luxor' },
      { name: 'Valley of the Kings', city: 'Luxor', governorate: 'Luxor' }
    ],
    // Day 3: Alexandria sites
    [
      { name: 'Bibliotheca Alexandrina', city: 'Alexandria', governorate: 'Alexandria' },
      { name: 'Citadel of Qaitbay', city: 'Alexandria', governorate: 'Alexandria' }
    ],
    // Day 4: Aswan sites
    [
      { name: 'Philae Temple', city: 'Aswan', governorate: 'Aswan' },
      { name: 'High Dam', city: 'Aswan', governorate: 'Aswan' }
    ],
    // Day 5+: Cairo sites
    [
      { name: 'Citadel of Saladin', city: 'Cairo', governorate: 'Cairo' },
      { name: 'Khan el-Khalili', city: 'Cairo', governorate: 'Cairo' }
    ]
  ];

  const dayIndex = Math.min(dayNumber - 1, fallbackSitesByDay.length - 1);
  const fallbackPair = fallbackSitesByDay[dayIndex];

  return fallbackPair.map((site, index) => ({
    ...site,
    description: `Historic site in ${site.city}`,
    similarity_score: 0.7,
    activities: ['Exploring', 'Photography'],
    opening_time: '08:00',
    closing_time: '17:00',
    average_time_spent_hours: 2.5,
    cost_egp: budget * (index === 0 ? 0.6 : 0.4),
    latitude: 30.0 + Math.random() * 2, // Approximate coordinates
    longitude: 31.0 + Math.random() * 2
  }));
};

// Build daily plan with RAG-based site selection
export const buildDailyPlan = async (userData, dayNumber, usedSites) => {
  console.log(`🏗️ Building daily plan for day ${dayNumber + 1}`);
  console.log(`Interests: ${userData.interests.join(', ')}`);

  const dailyBudget = userData.budget / userData.days;
  const sitesBudget = dailyBudget * 0.7;
  const foodBudget = dailyBudget * 0.3;

  console.log(`💰 Daily budget: ${dailyBudget} EGP (Sites: ${sitesBudget}, Food: ${foodBudget})`);

  let selectedSites = [];

  // Day 1: Always Pyramids + Egyptian Museum
  if (dayNumber === 0) {
    console.log(`🏛️ Day 1: Setting up Pyramids + Egyptian Museum`);
    selectedSites = await getDay1Sites(sitesBudget);
    console.log(`✅ Day 1 sites selected: ${selectedSites.map(s => s.name).join(', ')}`);
  } else {
    // Other days: Use RAG with governorate grouping
    console.log(`🔍 Day ${dayNumber + 1}: Using RAG with governorate grouping`);

    const interestsText = userData.interests.join(' ');
    console.log(`🔍 Generating embedding for: "${interestsText}"`);
    const userEmbedding = await generateEmbedding(interestsText);
    console.log(`📊 Generated embedding with ${userEmbedding.length} dimensions`);

    const targetCity = userData.cities ? userData.cities[dayNumber % userData.cities.length] : null;
    console.log(`🏙️ Target city: ${targetCity || 'Any city'}`);

    console.log(`🔍 Searching for sites with RAG...`);
    const sites = await getTopSimilarRecords(Site, userEmbedding, targetCity, 10, sitesBudget, userData.age);
    console.log(`📍 Found ${sites.length} sites from RAG search`);

    // Always select the closest pair of sites for the day
    const sitePair = selectClosestSitePair(sites, usedSites);
    selectedSites = sitePair;
    console.log(`✅ Selected closest site pair: ${selectedSites.map(s => s.name).join(', ')}`);
  }

  for (const site of selectedSites) {
    usedSites.add(site.name);
  }

  const formattedSites = selectedSites.map(site => ({
    name: site.name || 'Unknown Site',
    city: site.city || 'Cairo',
    description: site.description || 'No description available',
    similarity_score: site.similarity_score || 0.0,
    activities: site.activities || ['Exploring', 'Photography'],
    opening_time: site.opening_time || '08:00',
    closing_time: site.closing_time || '18:00',
    average_time_spent_hours: Number(site.average_time_spent_hours || 2.0),
    cost_egp: Number(site.cost_egp || site.budget || 0.0),
    latitude: site.latitude,
    longitude: site.longitude
  }));

  let distanceBetweenSites = 0.0;
  if (selectedSites.length === 2) {
    const coord1 = { latitude: selectedSites[0].latitude, longitude: selectedSites[0].longitude };
    const coord2 = { latitude: selectedSites[1].latitude, longitude: selectedSites[1].longitude };
    distanceBetweenSites = haversineDistance(coord1, coord2);
  }

  const restaurants = { breakfast: null, lunch: null, dinner: null };
  let dailyCost = formattedSites.reduce((sum, s) => sum + s.cost_egp, 0);

  if (selectedSites.length) {
    // Use the city from the selected sites for restaurant search
    const siteCity = selectedSites[0].city;
    console.log(`🍽️ Finding restaurants in ${siteCity} for day ${dayNumber + 1}`);
    const allRestaurants = await getRestaurantsByDistance(Restaurant, siteCity, foodBudget, 10);
    const firstSiteCoord = { latitude: selectedSites[0].latitude, longitude: selectedSites[0].longitude };

    const breakfast = allRestaurants.reduce((min, r) => {
      const dist = haversineDistance(firstSiteCoord, { latitude: r.latitude, longitude: r.longitude });
      return !min || dist < min.dist ? { ...r, dist } : min;
    }, null);

    if (breakfast) {
      restaurants.breakfast = {
        name: breakfast.name || 'Unknown Restaurant',
        city: breakfast.city || 'Cairo',
        description: breakfast.description || 'No description available',
        budget_egp: Number(breakfast.average_budget_egp || 0.0),
        opening_hours: breakfast.opening_hours || '08:00',
        closing_hours: breakfast.closing_hours || '16:00',
        distance_km: breakfast.dist
      };
      dailyCost += breakfast.average_budget_egp || 0.0;
    }

    if (selectedSites.length === 2) {
      const midpoint = getMidpoint(
        { latitude: selectedSites[0].latitude, longitude: selectedSites[0].longitude },
        { latitude: selectedSites[1].latitude, longitude: selectedSites[1].longitude }
      );
      const lunchCandidates = allRestaurants.filter(r => r !== breakfast);
      const lunch = lunchCandidates.reduce((min, r) => {
        const dist = haversineDistance(midpoint, { latitude: r.latitude, longitude: r.longitude });
        return !min || dist < min.dist ? { ...r, dist } : min;
      }, null);

      if (lunch) {
        restaurants.lunch = {
          name: lunch.name || 'Unknown Restaurant',
          city: lunch.city || 'Cairo',
          description: lunch.description || 'No description available',
          budget_egp: Number(lunch.average_budget_egp || 0.0),
          opening_hours: lunch.opening_hours || '11:00',
          closing_hours: lunch.closing_hours || '20:00',
          distance_km: lunch.dist
        };
        dailyCost += lunch.average_budget_egp || 0.0;
      }
    }

    const secondSiteCoord = selectedSites.length === 2 
      ? { latitude: selectedSites[1].latitude, longitude: selectedSites[1].longitude }
      : firstSiteCoord;
    const dinnerCandidates = allRestaurants.filter(r => r !== breakfast && r !== lunch);
    const dinner = dinnerCandidates.reduce((min, r) => {
      const dist = haversineDistance(secondSiteCoord, { latitude: r.latitude, longitude: r.longitude });
      return !min || dist < min.dist ? { ...r, dist } : min;
    }, null);

    if (dinner) {
      restaurants.dinner = {
        name: dinner.name || 'Unknown Restaurant',
        city: dinner.city || 'Cairo',
        description: dinner.description || 'No description available',
        budget_egp: Number(dinner.average_budget_egp || 0.0),
        opening_hours: dinner.opening_hours || '14:00',
        closing_hours: dinner.closing_hours || '23:00',
        distance_km: dinner.dist
      };
      dailyCost += dinner.average_budget_egp || 0.0;
    }
  }

  // Generate comprehensive itinerary using AI
  let comprehensiveItinerary = null;
  try {
    console.log(`🤖 Generating AI-powered comprehensive itinerary for day ${dayNumber + 1}`);
    comprehensiveItinerary = await generateComprehensiveItinerary(
      formattedSites,
      restaurants,
      userData,
      dayNumber
    );
    console.log(`✅ Generated comprehensive itinerary for day ${dayNumber + 1}`);
  } catch (error) {
    console.error(`❌ Error generating comprehensive itinerary for day ${dayNumber + 1}:`, error.message);
  }

  return {
    day: dayNumber + 1,
    sites: formattedSites,
    distance_between_sites_km: Number(distanceBetweenSites),
    restaurants,
    daily_cost_egp: Number(dailyCost),
    comprehensive_itinerary: comprehensiveItinerary // Add the AI-generated comprehensive plan
  };
};

// Build complete trip plan
export const buildTripPlan = async (userData) => {
  console.log('🚀 Starting trip plan generation...');
  console.log('User data:', userData);

  try {
    const tripPlan = {
      user_preferences: {
        age: userData.age,
        total_budget_egp: Number(userData.budget),
        daily_budget_egp: Number(userData.budget / userData.days),
        interests: userData.interests,
        duration_days: userData.days,
        city: userData.cities ? userData.cities[0] : 'Not specified (Nationwide)'
      },
      days: [],
      trip_summary: {
        total_trip_cost_egp: 0.0,
        remaining_budget_egp: 0.0
      }
    };

    const usedSites = new Set();
    console.log(`📅 Generating ${userData.days} days of itinerary...`);

    for (let day = 0; day < userData.days; day++) {
      console.log(`\n--- Day ${day + 1} ---`);
      try {
        const dailyPlan = await buildDailyPlan(userData, day, usedSites);
        tripPlan.days.push(dailyPlan);
        console.log(`✅ Day ${day + 1} completed successfully`);
      } catch (dayError) {
        console.error(`❌ Error building day ${day + 1}:`, dayError.message);
        // Add a fallback day
        tripPlan.days.push({
          day: day + 1,
          sites: [],
          distance_between_sites_km: 0,
          restaurants: { breakfast: null, lunch: null, dinner: null },
          daily_cost_egp: 0
        });
      }
    }

    const totalCost = tripPlan.days.reduce((sum, day) => sum + day.daily_cost_egp, 0);
    tripPlan.trip_summary.total_trip_cost_egp = Number(totalCost);
    tripPlan.trip_summary.remaining_budget_egp = Number(userData.budget - totalCost);

    console.log('🎉 Trip plan generation completed!');
    console.log(`Total cost: ${totalCost} EGP`);
    console.log(`Days generated: ${tripPlan.days.length}`);

    return tripPlan;
  } catch (error) {
    console.error('❌ Critical error in buildTripPlan:', error);
    throw error;
  }
};

// Convert MongoDB trip plan to frontend format
export const convertTripPlanToFrontendFormat = (tripPlan) => {
  const suggestions = [];
  
  tripPlan.days.forEach((day, dayIndex) => {
    day.sites.forEach((site, siteIndex) => {
      suggestions.push({
        id: `mongo-site-${dayIndex}-${siteIndex}`,
        name: site.name,
        region: site.city,
        category: 'historical', // Default category
        shortDescription: site.description,
        coverImage: `/src/assets/destinations/${site.name.toLowerCase().replace(/\s+/g, '-')}.svg`,
        averageRating: Math.min(5, 3 + site.similarity_score * 2), // Convert similarity to rating
        reviewCount: Math.floor(Math.random() * 1000) + 100,
        entryFee: { adult: `${site.cost_egp} EGP` },
        visitDuration: `${site.average_time_spent_hours} hours`,
        reason: `Similarity score: ${site.similarity_score}`,
        priority: site.similarity_score > 0.7 ? 'high' : site.similarity_score > 0.4 ? 'medium' : 'low',
        mongoData: site // Keep original data for reference
      });
    });
  });

  return {
    destinations: suggestions,
    tripPlan: tripPlan,
    dailyPlans: tripPlan.days,
    totalEstimatedCost: tripPlan.trip_summary.total_trip_cost_egp,
    recommendations: [
      'Book popular attractions in advance',
      'Stay hydrated and wear sun protection',
      'Consider hiring local guides for historical sites'
    ]
  };
};

// Utility: Find nearest restaurant to a point, excluding some IDs
async function findNearestRestaurant(point, excludeIds = []) {
  const allRestaurants = await Restaurant.find({}).lean();
  const filtered = allRestaurants.filter(r => !excludeIds.includes(String(r._id)));
  return filtered.reduce((min, r) => {
    const dist = haversineDistance(point, { latitude: r.latitude, longitude: r.longitude });
    return !min || dist < min.dist ? { ...r, dist } : min;
  }, null);
}

// Main function: Get breakfast, lunch, dinner restaurants for two sites
export async function getDayRestaurants(firstSite, secondSite) {
  const breakfast = await findNearestRestaurant(
    { latitude: firstSite.latitude, longitude: firstSite.longitude }
  );

  const midpoint = getMidpoint(
    { latitude: firstSite.latitude, longitude: firstSite.longitude },
    { latitude: secondSite.latitude, longitude: secondSite.longitude }
  );
  const lunch = await findNearestRestaurant(
    midpoint,
    breakfast ? [String(breakfast._id)] : []
  );

  const dinner = await findNearestRestaurant(
    { latitude: secondSite.latitude, longitude: secondSite.longitude },
    [breakfast ? String(breakfast._id) : null, lunch ? String(lunch._id) : null].filter(Boolean)
  );

  return {
    breakfast,
    lunch,
    dinner
  };
}
