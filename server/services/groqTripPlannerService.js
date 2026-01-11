import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ── CONNECTIONS ────────────────────────────────────────────────────────────────
// We’ll create two distinct connections:
//  • `tourismConn` points to the “tourism” database (contains “sites” collection).
//  • `restaurantConn` points to the “Resturants” database (contains “Egyptian” collection).

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://abdelrahmannasser139:12345@cluster0.5ddi3ns.mongodb.net/';

const tourismConn = mongoose.createConnection(
  `${MONGO_URI}tourism`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const restaurantConn = mongoose.createConnection(
  `${MONGO_URI}Resturants`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

tourismConn.once('open', () => {
  console.log('✅ Connected to “tourism” database (sites collection)');
});
tourismConn.on('error', err => {
  console.error('❌ tourismConn connection error:', err);
});

restaurantConn.once('open', () => {
  console.log('✅ Connected to “Resturants” database (Egyptian collection)');
});
restaurantConn.on('error', err => {
  console.error('❌ restaurantConn connection error:', err);
});

// ── SCHEMAS ─────────────────────────────────────────────────────────────────────
const siteSchema = new mongoose.Schema({
  name: String,
  city: String,
  description: String,
  searchbyembedding: [Number],
  activities: [String],
  opening_time: String,
  closing_time: String,
  average_time_spent_hours: Number,
  budget: Number,
  latitude: Number,
  longitude: Number,
  age_limit: Number
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  city: String,
  description: String,
  average_budget_egp: Number,
  opening_hours: String,
  closing_hours: String,
  latitude: Number,
  longitude: Number
});

// ── MODELS ──────────────────────────────────────────────────────────────────────
// Bind each model to its respective connection and collection name:
export const Site = tourismConn.model('Site', siteSchema, 'sites');
export const Restaurant = restaurantConn.model('Restaurant', restaurantSchema, 'Egyptian');

// ── UTILITY FUNCTIONS ───────────────────────────────────────────────────────────
export const haversineDistance = (coord1, coord2) => {
  const R = 6371.0; // Earth's radius in kilometers
  const toRad = x => x * Math.PI / 180;
  const lat1 = toRad(coord1.latitude),
    lon1 = toRad(coord1.longitude);
  const lat2 = toRad(coord2.latitude),
    lon2 = toRad(coord2.longitude);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
};

// Embedding generation (placeholder – replace with real API)
export const generateEmbedding = async (text) => {
  if (!text) return Array(384).fill(0);
  const prefix = "Represent this sentence for searching relevant passages: ";
  const fullText = text.startsWith(prefix) ? text : prefix + text.trim();

  try {
    // TODO: plug in your actual embedding API call
    console.log('Generating embedding for:', text);
    return Array(384).fill(0).map(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Embedding API error:', error.message);
    return Array(384).fill(0);
  }
};

export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return magA && magB ? dotProduct / (magA * magB) : 0;
};

// ── Enhanced Itinerary Generation with RAG ────────────────────────────────────────────
export const generateComprehensiveItinerary = async (sites, restaurants, userData, dayNumber) => {
  console.log(`🎯 Generating comprehensive itinerary for day ${dayNumber + 1}`);

  const interestsText = userData.interests.join(' ');
  const prompt = `
Create a concise full-day itinerary for Day ${dayNumber + 1} in Egypt.

USER: Age ${userData.age}, interests: ${userData.interests.join(', ')}, budget: ${userData.budget} EGP total

CURRENCY REFERENCE:
- 1 USD = 50 EGP
- 1 EUR = 58 EGP
- All prices should be mentioned in EGP

SITES TODAY:
${sites.map(site => `- ${site.name} (${site.city}): ${site.description.substring(0, 100)}...`).join('\n')}

RESTAURANTS:
${restaurants.breakfast ? `- Breakfast: ${restaurants.breakfast.name}` : ''}
${restaurants.lunch ? `- Lunch: ${restaurants.lunch.name}` : ''}
${restaurants.dinner ? `- Dinner: ${restaurants.dinner.name}` : ''}

Create a structured day plan with:
- Hour-by-hour timeline
- Brief site descriptions
- Key practical tips (including estimated costs in EGP)
- Transportation notes

Keep it concise but informative. Focus on the experience, not lengthy explanations.
`;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating comprehensive itinerary:', error.message);
    // Fallback to basic itinerary
    return generateBasicItinerary(sites, restaurants, dayNumber);
  }
};

const generateBasicItinerary = (sites, restaurants, dayNumber) => {
  let itinerary = `🌅 **Day ${dayNumber + 1} - Your Egyptian Adventure**\n\n`;

  if (restaurants.breakfast) {
    itinerary += `**8:00 AM - Breakfast**\n`;
    itinerary += `Start your day at ${restaurants.breakfast.name}\n`;
    itinerary += `💡 *Tip: Try traditional Egyptian breakfast with ful medames and fresh bread*\n\n`;
  }

  sites.forEach((site, index) => {
    const time = index === 0 ? '9:30 AM' : '2:00 PM';
    itinerary += `**${time} - ${site.name}**\n`;
    itinerary += `📍 Location: ${site.city}\n`;
    itinerary += `⏱️ Duration: ${site.average_time_spent_hours} hours\n`;
    itinerary += `${site.description}\n`;
    itinerary += `🎯 *Activities: ${site.activities?.join(', ') || 'Exploring, Photography'}*\n\n`;
  });

  if (restaurants.lunch) {
    itinerary += `**1:00 PM - Lunch Break**\n`;
    itinerary += `Enjoy lunch at ${restaurants.lunch.name}\n`;
    itinerary += `💡 *Perfect time to rest and try local specialties*\n\n`;
  }

  if (restaurants.dinner) {
    itinerary += `**7:00 PM - Dinner**\n`;
    itinerary += `End your day at ${restaurants.dinner.name}\n`;
    itinerary += `🌙 *Experience authentic Egyptian cuisine in a local setting*\n\n`;
  }

  itinerary += `✨ **Day Summary**: A perfect blend of history, culture, and cuisine!`;

  return itinerary;
};

// ── Groq-powered Trip Data Extraction ────────────────────────────────────────────
export const extractTripDataConversational = async (message, conversationHistory = []) => {
  // No need to “await connectMongoDB” here, since our connections are already open
  const conversation = [
    {
      role: 'system',
      content: `
You are Amira, a friendly Egyptian travel assistant who loves helping people discover Egypt! Be warm, enthusiastic, and helpful while staying concise.

YOUR MISSION: Extract trip planning information from natural language and guide users through a friendly conversation.

CONVERSATION FLOW:
1. **First Message**: User describes their trip naturally
2. **Extract & Review**: Extract what you can, show it to user, ask for missing info
3. **Complete**: When all info is gathered, generate trip plan

INFORMATION NEEDED:
1. **Age** (5-100 years)
2. **Budget in EGP** (minimum 1,000 EGP/day)
3. **Trip Duration** (1-30 days)
4. **Interests** (history, beaches, culture, adventure, etc.)
5. **Cities** (optional - Cairo, Luxor, Hurghada, Sharm El Sheikh, etc.)

EXTRACTION GUIDELINES:
- Extract ANY information you can find from user's natural language
- Look for age mentions: "I'm 25", "25 years old", "I am twenty-five"
- Look for budget: "2000 EGP", "around 1500 per day", "budget of 3000"
- Look for duration: "5 days", "week long", "10 day trip"
- Look for interests: "love history", "interested in beaches", "cultural sites"
- Look for cities: "want to visit Cairo", "Luxor sounds amazing"

CURRENCY CONVERSION (ALWAYS convert to EGP):
- 1 USD = 50 EGP
- 1 EUR = 58 EGP
- If user mentions "$100" or "100 dollars", convert to "5000 EGP"
- If user mentions "€100" or "100 euros", convert to "5800 EGP"
- Always show the conversion: "That's 5000 EGP (converted from $100)"

RESPONSE FORMATS:

**After extracting information, ALWAYS show what you found:**
"Great! Let me confirm what I understood:
✅ Age: [AGE] years old
✅ Budget: [BUDGET] EGP per day
✅ Duration: [DAYS] days
✅ Interests: [INTERESTS]
✅ Cities: [CITIES or "I'll recommend the best ones"]

Is this correct? And I still need: [LIST MISSING INFO]"

**When asking for missing info:**
- Be specific and friendly
- Explain why you need it
- Ask for ONE missing piece at a time

**When complete, return ONLY this JSON:**
{
  "age": AGE_NUMBER,
  "budget": BUDGET_NUMBER_IN_EGP,
  "days": DAYS_NUMBER,
  "interests": ["interest1", "interest2"],
  "cities": ["City1"] or [],
  "complete": true
}

PERSONALITY:
- Warm and enthusiastic about Egypt
- Use encouraging language ("Perfect!" "Wonderful!" "Egypt is amazing for that!")
- Keep responses concise but friendly (4-5 sentences max)
- Show excitement about their trip choices
      `
    },
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: conversation,
      temperature: 0.5,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = response.data.choices[0].message.content;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (data.complete && ['age', 'budget', 'days', 'interests', 'cities'].every(key => key in data)) {
          data.cities = data.cities.length ? data.cities : null;
          return { success: true, data, response: responseText };
        }
      }
    } catch (parseError) {
      console.log('No JSON found, treating as conversational response');
    }

    return {
      success: true,
      data: { complete: false },
      response: responseText
    };
  } catch (error) {
    console.error('Groq API error:', error.message);
    console.error('Error details:', error.response?.data || 'No response data');
    console.error('Status code:', error.response?.status || 'No status');
    console.error('Request URL:', error.config?.url || 'No URL');
    return {
      success: false,
      error: 'Failed to process request',
      response: 'Sorry, I encountered an error. Please try again.'
    };
  }
};

// ── INITIALIZATION CHECK (OPTIONAL) 
export const initializeGroqTripPlanner = async () => {
  // Verify that each connection is ready
  if (tourismConn.readyState === 1) {
    try {
      const siteCount = await tourismConn.collection('sites').countDocuments();
      console.log(`📊 tourism.sites collection: ${siteCount} documents`);
      if (siteCount > 0) {
        const sampleSite = await tourismConn.collection('sites').findOne();
        console.log(`📋 Sample site: ${JSON.stringify({
          name: sampleSite.name,
          city: sampleSite.city,
          hasEmbedding: Array.isArray(sampleSite.searchbyembedding) && sampleSite.searchbyembedding.length > 0
        })}`);
      }
    } catch (e) {
      console.error('❌ Error querying tourism.sites:', e.message);
    }
  }

  if (restaurantConn.readyState === 1) {
    try {
      const restCount = await restaurantConn.collection('Egyptian').countDocuments();
      console.log(`📊 Resturants.Egyptian collection: ${restCount} documents`);
      if (restCount > 0) {
        const sampleRest = await restaurantConn.collection('Egyptian').findOne();
        console.log(`📋 Sample restaurant: ${JSON.stringify({
          name: sampleRest.name,
          city: sampleRest.city,
          average_budget_egp: sampleRest.average_budget_egp
        })}`);
      }
    } catch (e) {
      console.error('❌ Error querying Resturants.Egyptian:', e.message);
    }
  }

  console.log('✅ Groq Trip Planner Service initialized');
};

// ── RAG SEARCH ──────────────────────────────────────────────────────────────────
export const getTopSimilarRecords = async (collection, userEmbedding, city = null, limit = 6, budgetConstraint = null, ageConstraint = null) => {
  console.log(`🔍 RAG Search - Collection: ${collection.modelName}`);
  console.log(`🔍 RAG Search - City filter: ${city || 'None'}`);
  console.log(`🔍 RAG Search - Budget constraint: ${budgetConstraint || 'None'}`);
  console.log(`🔍 RAG Search - Age constraint: ${ageConstraint || 'None'}`);

  let query = { searchbyembedding: { $exists: true, $ne: [] } };
  if (city) query.city = city;
  if (budgetConstraint !== null) {
    query[collection.modelName === 'Site' ? 'budget' : 'average_budget_egp'] = { $lte: budgetConstraint };
  }
  if (ageConstraint !== null && collection.modelName === 'Site') {
    query.age_limit = { $lte: ageConstraint };
  }

  console.log(`🔍 MongoDB Query:`, JSON.stringify(query, null, 2));

  try {
    const candidates = await collection.find(query).lean();
    console.log(`📊 Found ${candidates.length} candidates from database`);

    if (!candidates.length) {
      console.log(`⚠️ No candidates found – trying without embedding filter…`);
      const fallbackQuery = {};
      if (city) fallbackQuery.city = city;
      const fallbackCandidates = await collection.find(fallbackQuery).limit(10).lean();
      console.log(`📊 Fallback search found ${fallbackCandidates.length} documents`);

      if (fallbackCandidates.length > 0) {
        console.log(`📋 Sample document:`, JSON.stringify(fallbackCandidates[0], null, 2));
        return fallbackCandidates.slice(0, limit).map(doc => ({
          ...doc,
          similarity_score: Math.random() * 0.5 + 0.5
        }));
      }
      return [];
    }

    const validCandidates = [];
    const dbEmbeddings = [];
    const expectedDim = userEmbedding.length;

    for (const doc of candidates) {
      const embedding = doc.searchbyembedding || [];
      if (Array.isArray(embedding) && embedding.length === expectedDim) {
        validCandidates.push(doc);
        dbEmbeddings.push(embedding);
      } else {
        console.log(`⚠️ Invalid embedding for ${doc.name}: length ${embedding.length}, expected ${expectedDim}`);
      }
    }

    console.log(`✅ Valid candidates with embeddings: ${validCandidates.length}`);

    if (!dbEmbeddings.length) {
      console.log(`⚠️ No valid embeddings found – returning candidates with mock scores`);
      return candidates.slice(0, limit).map(doc => ({
        ...doc,
        similarity_score: Math.random() * 0.5 + 0.5
      }));
    }

    const similarities = dbEmbeddings.map(emb => cosineSimilarity(userEmbedding, emb));
    const indexedSims = similarities.map((sim, idx) => [idx, sim]);
    indexedSims.sort((a, b) => b[1] - a[1]);

    const topIndices = indexedSims.slice(0, limit).map(([idx]) => idx);
    const topRecords = topIndices.map(idx => ({
      ...validCandidates[idx],
      similarity_score: Number(similarities[idx].toFixed(2))
    }));

    console.log(`🎯 Returning ${topRecords.length} top similar records`);
    return topRecords;
  } catch (error) {
    console.error(`❌ Error in RAG search:`, error.message);
    return [];
  }
};

// ── ROUTING HELPERS ─────────────────────────────────────────────────────────────
export const selectClosestSitePair = (sites, usedSites = new Set()) => {
  const availableSites = sites.filter(site => !usedSites.has(site.name));
  if (availableSites.length < 2) return availableSites.slice(0, 2);

  let minDistance = Infinity;
  let closestPair = null;

  for (let i = 0; i < availableSites.length; i++) {
    for (let j = i + 1; j < availableSites.length; j++) {
      const coord1 = { latitude: availableSites[i].latitude, longitude: availableSites[i].longitude };
      const coord2 = { latitude: availableSites[j].latitude, longitude: availableSites[j].longitude };
      const distance = haversineDistance(coord1, coord2);
      if (distance < minDistance) {
        minDistance = distance;
        closestPair = [availableSites[i], availableSites[j]];
      }
    }
  }

  return closestPair || availableSites.slice(0, 2);
};

export const getMidpoint = (coord1, coord2) => {
  const toRad = x => x * Math.PI / 180;
  const toDeg = x => x * 180 / Math.PI;
  const lat1 = toRad(coord1.latitude),
    lon1 = toRad(coord1.longitude);
  const lat2 = toRad(coord2.latitude),
    lon2 = toRad(coord2.longitude);

  const x1 = Math.cos(lat1) * Math.cos(lon1);
  const y1 = Math.cos(lat1) * Math.sin(lon1);
  const z1 = Math.sin(lat1);
  const x2 = Math.cos(lat2) * Math.cos(lon2);
  const y2 = Math.cos(lat2) * Math.sin(lon2);
  const z2 = Math.sin(lat2);

  const x = (x1 + x2) / 2;
  const y = (y1 + y2) / 2;
  const z = (z1 + z2) / 2;
  const lon = Math.atan2(y, x);
  const hyp = Math.sqrt(x * x + y * y);
  const lat = Math.atan2(z, hyp);

  return { latitude: toDeg(lat), longitude: toDeg(lon) };
};
