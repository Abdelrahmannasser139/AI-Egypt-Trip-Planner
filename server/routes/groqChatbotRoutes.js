import express from 'express';
import { 
  extractTripDataConversational, 
  initializeGroqTripPlanner 
} from '../services/groqTripPlannerService.js';
import { 
  buildTripPlan, 
  convertTripPlanToFrontendFormat 
} from '../services/tripBuilderService.js';

const router = express.Router();

// Initialize the service
initializeGroqTripPlanner();

// Store conversation sessions
const chatSessions = new Map();

// POST /api/groq-chatbot/message
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId, context = {} } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Create a unique session ID if not provided
    const currentSessionId = sessionId || `groq_session_${Date.now()}`;
    
    // Get or initialize chat history for this session
    let conversationHistory = chatSessions.get(currentSessionId) || [];
    
    console.log('Processing message:', message);
    console.log('Session ID:', currentSessionId);
    
    // Extract trip data using Groq LLaMA
    const result = await extractTripDataConversational(message, conversationHistory);
    
    if (!result.success) {
      return res.status(500).json({ 
        error: result.error,
        response: result.response,
        sessionId: currentSessionId
      });
    }
    
    // Update conversation history
    conversationHistory.push({ role: 'user', content: message });
    conversationHistory.push({ role: 'assistant', content: result.response });
    
    // Keep only last 10 messages to avoid token limits
    if (conversationHistory.length > 20) {
      conversationHistory = conversationHistory.slice(conversationHistory.length - 20);
    }
    
    // Save updated history
    chatSessions.set(currentSessionId, conversationHistory);
    
    let suggestions = null;
    let tripPlan = null;
    let extractedInfo = null;
    
    // If we have complete trip data, generate the trip plan
    if (result.data.complete) {
      console.log('🎯 Complete trip data received, generating trip plan...');
      console.log('Trip data:', result.data);

      try {
        // Build the trip plan using MongoDB RAG
        console.log('🔍 Starting RAG-based trip planning...');
        tripPlan = await buildTripPlan(result.data);
        console.log('✅ Trip plan generated:', tripPlan ? 'Success' : 'Failed');

        if (tripPlan && tripPlan.days && tripPlan.days.length > 0) {
          // Convert to frontend format
          const frontendData = convertTripPlanToFrontendFormat(tripPlan);
          suggestions = frontendData;

          console.log('📊 Trip plan summary:');
          console.log(`- Days: ${tripPlan.days.length}`);
          console.log(`- Total cost: ${tripPlan.trip_summary.total_trip_cost_egp} EGP`);
          console.log(`- Destinations found: ${frontendData.destinations.length}`);

          // Extract info for frontend
          extractedInfo = {
            age: result.data.age,
            budget: result.data.budget,
            days: result.data.days,
            interests: result.data.interests,
            cities: result.data.cities,
            duration: `${result.data.days} days`,
            travelStyle: 'standard'
          };

          // Override the response with comprehensive trip plan details
          let comprehensiveResponse = `🎉 Perfect! I've created your personalized ${result.data.days}-day Egypt itinerary!\n\n`;

          // Add budget analysis
          comprehensiveResponse += `💰 **Budget Analysis:**\n` +
            `- Total Budget: ${result.data.budget} EGP\n` +
            `- Estimated Cost: ${tripPlan.trip_summary.total_trip_cost_egp.toFixed(2)} EGP\n` +
            `- Remaining: ${tripPlan.trip_summary.remaining_budget_egp.toFixed(2)} EGP\n\n`;

          // Add comprehensive daily itineraries
          tripPlan.days.forEach((day, index) => {
            if (day.comprehensive_itinerary) {
              comprehensiveResponse += `📅 **Day ${day.day} - Comprehensive Plan:**\n\n`;
              comprehensiveResponse += day.comprehensive_itinerary + '\n\n';
              comprehensiveResponse += `---\n\n`;
            } else {
              // Fallback to basic format if comprehensive itinerary is not available
              comprehensiveResponse += `📅 **Day ${day.day}:** ${day.sites.map(site => site.name).join(', ')}\n\n`;
            }
          });

          comprehensiveResponse += `✨ I've created detailed day-by-day plans with comprehensive information, practical tips, and local insights. Check your day tabs above to see the full itineraries!`;

          result.response = comprehensiveResponse;

        } else {
          console.log('⚠️ No trip plan generated - using fallback');
          result.response += '\n\n⚠️ I\'m having trouble accessing the destination database right now, but I can still help you plan your trip manually!';
        }

      } catch (planError) {
        console.error('❌ Error generating trip plan:', planError.message);
        console.error('Stack trace:', planError.stack);
        result.response += '\n\n⚠️ I encountered an issue accessing the destination database, but I can still help you plan your trip!';
      }
    }
    
    // Return response
    const responseData = {
      sessionId: currentSessionId,
      response: result.response,
      extractedInfo,
      suggestions,
      tripPlan,
      isItineraryPlanning: true,
      isComplete: result.data.complete || false
    };
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Error in Groq chatbot:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: error.message,
      sessionId: req.body.sessionId || `groq_session_${Date.now()}`
    });
  }
});

// POST /api/groq-chatbot/plan-trip - Direct trip planning endpoint
router.post('/plan-trip', async (req, res) => {
  try {
    const { age, budget, days, interests, cities } = req.body;
    
    // Validate required fields
    if (!age || !budget || !days || !interests || !Array.isArray(interests)) {
      return res.status(400).json({ 
        error: 'Missing required fields: age, budget, days, interests' 
      });
    }
    
    const userData = {
      age: Number(age),
      budget: Number(budget),
      days: Number(days),
      interests,
      cities: cities || []
    };
    
    console.log('Direct trip planning request:', userData);
    
    // Build the trip plan
    const tripPlan = await buildTripPlan(userData);
    
    // Convert to frontend format
    const frontendData = convertTripPlanToFrontendFormat(tripPlan);
    
    res.json({
      success: true,
      tripPlan,
      suggestions: frontendData,
      summary: `Generated ${tripPlan.days.length}-day trip plan for ${userData.interests.join(', ')} with budget ${userData.budget} EGP`
    });
    
  } catch (error) {
    console.error('Error in direct trip planning:', error);
    res.status(500).json({ 
      error: 'Failed to generate trip plan',
      message: error.message 
    });
  }
});

// GET /api/groq-chatbot/test - Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Groq Chatbot API is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/groq-chatbot/message - Chat with the bot',
      'POST /api/groq-chatbot/plan-trip - Direct trip planning',
      'GET /api/groq-chatbot/test - This test endpoint'
    ]
  });
});

// DELETE /api/groq-chatbot/session/:sessionId - Clear session
router.delete('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  
  if (chatSessions.has(sessionId)) {
    chatSessions.delete(sessionId);
    res.json({ message: 'Session cleared successfully' });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

export default router;
