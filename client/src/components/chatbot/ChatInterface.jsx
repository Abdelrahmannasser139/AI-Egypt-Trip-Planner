import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { PaperAirplaneIcon, ArrowPathIcon, XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// Import real API service
import { sendGroqChatMessage } from '../../services/groqChatbotService';

const ChatInterface = ({ itineraryContext, onPlanGenerated }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isAuthenticated, user } = useAuth();

  // State for plan generation
  const [isPlanReady, setIsPlanReady] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage = itineraryContext
      ? `# Let's Plan Your Egyptian Adventure! 🏺

I'm your AI travel assistant, and I'll help you create a detailed itinerary for your trip to Egypt from ${itineraryContext.startDate} to ${itineraryContext.endDate}.

## To create your perfect itinerary, I'll need to know:

- What specific destinations in Egypt interest you most?
- What activities do you enjoy (historical sites, beaches, cultural experiences)?
- Any dietary preferences or restrictions?
- Your preferred pace (relaxed or action-packed)?
- Any must-see attractions on your list?

Let's start planning your Egyptian adventure! What are you most excited to experience in Egypt?`
      : `# Welcome to Ray7 Masr! 🏺

I'm your AI travel assistant specializing in Egyptian tourism. I can help you plan your perfect trip to Egypt by providing information about destinations, creating personalized itineraries, and offering cultural insights.

## How can I help you today?

- Tell me about your travel plans and preferences
- Ask about specific destinations in Egypt
- Get recommendations for itineraries
- Learn about Egyptian culture, food, and customs
- Get practical travel advice

What would you like to know about Egypt?`;

    setMessages([
      {
        role: 'assistant',
        content: welcomeMessage
      }
    ]);
  }, [itineraryContext]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create chat history for API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      // Include itinerary context if available
      const contextInfo = itineraryContext ? {
        itineraryId: itineraryContext.id,
        title: itineraryContext.title,
        startDate: itineraryContext.startDate,
        endDate: itineraryContext.endDate,
        budget: itineraryContext.budget,
        travelStyle: itineraryContext.travelStyle,
        interests: itineraryContext.interests || []
      } : undefined;

      // Use real API instead of mock service
      const response = await sendGroqChatMessage({
        message: input,
        sessionId: undefined, // or manage sessionId if needed
        context: contextInfo
      });

      // Add bot response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);

      // Check if we have enough information to generate a plan
      if (messages.length > 4 && !isPlanReady) {
        setIsPlanReady(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate itinerary plan
  const generatePlan = async () => {
    setIsLoading(true);

    try {
      // Create a prompt for generating the plan
      const planPrompt = "Based on our conversation, please create a detailed day-by-day itinerary plan for my trip to Egypt.";

      // Add user message to chat
      const userMessage = { role: 'user', content: planPrompt };
      setMessages(prev => [...prev, userMessage]);

      // Create chat history for API
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));

      // Include itinerary context if available
      const contextInfo = itineraryContext ? {
        itineraryId: itineraryContext.id,
        title: itineraryContext.title,
        startDate: itineraryContext.startDate,
        endDate: itineraryContext.endDate,
        budget: itineraryContext.budget,
        travelStyle: itineraryContext.travelStyle,
        interests: itineraryContext.interests || [],
        generatePlan: true // Signal to generate a structured plan
      } : undefined;

      // Use real API to generate plan
      const response = await sendGroqChatMessage({
        message: planPrompt,
        sessionId: undefined, // or manage sessionId if needed
        context: contextInfo
      });

      // Add bot response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response
      }]);
      setGeneratedPlan(response.data.plan || response.data.response);

      // Emit event to parent component if needed
      if (typeof onPlanGenerated === 'function') {
        onPlanGenerated(response.data.plan || response.data.response);
      }
    } catch (error) {
      console.error('Error generating plan:', error);

      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating your itinerary plan. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    const welcomeMessage = itineraryContext
      ? `# Let's Plan Your Egyptian Adventure! 🏺

I'm your AI travel assistant, and I'll help you create a detailed itinerary for your trip to Egypt from ${itineraryContext.startDate} to ${itineraryContext.endDate}.

## To create your perfect itinerary, I'll need to know:

- What specific destinations in Egypt interest you most?
- What activities do you enjoy (historical sites, beaches, cultural experiences)?
- Any dietary preferences or restrictions?
- Your preferred pace (relaxed or action-packed)?
- Any must-see attractions on your list?

Let's start planning your Egyptian adventure! What are you most excited to experience in Egypt?`
      : `# Welcome to Ray7 Masr! 🏺

I'm your AI travel assistant specializing in Egyptian tourism. I can help you plan your perfect trip to Egypt by providing information about destinations, creating personalized itineraries, and offering cultural insights.

## How can I help you today?

- Tell me about your travel plans and preferences
- Ask about specific destinations in Egypt
- Get recommendations for itineraries
- Learn about Egyptian culture, food, and customs
- Get practical travel advice

What would you like to know about Egypt?`;

    setMessages([
      {
        role: 'assistant',
        content: welcomeMessage
      }
    ]);

    // Reset plan state
    setIsPlanReady(false);
    setGeneratedPlan(null);
  };

  // Suggestion chips
  const suggestions = itineraryContext ? [
    { text: 'Visit Pyramids & Sphinx', query: "I want to visit the Pyramids of Giza and the Sphinx" },
    { text: 'Luxor & Valley of Kings', query: "I'm interested in Luxor and the Valley of the Kings" },
    { text: 'Relaxed Pace', query: "I want a relaxed pace with time to explore each site" },
    { text: 'Food Recommendations', query: "I love Egyptian cuisine and want food recommendations" }
  ] : [
    { text: 'Pyramids of Giza', query: 'Tell me about the Pyramids of Giza' },
    { text: 'Karnak Temple Info', query: 'What are the visiting hours and fees for Karnak Temple?' },
    { text: 'Cairo Restaurants', query: 'Recommend traditional Egyptian restaurants in Cairo' },
    { text: '7-day itinerary', query: 'I have 7 days in Egypt. What itinerary do you recommend?' },
    { text: 'Abu Simbel', query: 'What\'s special about Abu Simbel?' },
    { text: 'Koshari Places', query: 'Where can I eat authentic koshari?' }
  ];

  // Handle suggestion click
  const handleSuggestionClick = (query) => {
    setInput(query);
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="flex flex-col h-full bg-papyrus rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-nile-blue p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/src/assets/pharaoh-logo-white.svg" alt="Pharaoh's Compass Logo" className="h-8 w-8 mr-2" />
          <h2 className="text-white font-semibold">Pharaoh's Compass</h2>
        </div>
        <div className="flex items-center space-x-2">
          {isPlanReady && (
            <button
              onClick={generatePlan}
              className="text-white hover:text-pharaoh-gold transition-colors flex items-center"
              title="Generate Itinerary Plan"
              disabled={isLoading}
            >
              <DocumentTextIcon className="h-5 w-5 mr-1" />
              <span className="text-sm">Generate Plan</span>
            </button>
          )}
          <button
            onClick={clearChat}
            className="text-white hover:text-pharaoh-gold transition-colors"
            title="Clear chat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3/4 rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-pharaoh-gold/10 text-hieroglyph-black'
                  : 'bg-white text-hieroglyph-black'
              }`}
            >
              {message.role === 'assistant' ? (
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 flex items-center space-x-2">
              <div className="animate-pulse flex space-x-1">
                <div className="h-2 w-2 bg-nile-blue rounded-full"></div>
                <div className="h-2 w-2 bg-nile-blue rounded-full animation-delay-200"></div>
                <div className="h-2 w-2 bg-nile-blue rounded-full animation-delay-400"></div>
              </div>
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips */}
      <div className="px-4 py-2 flex flex-wrap gap-2 bg-white/50">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion.query)}
            className="bg-white text-nile-blue text-sm px-3 py-1 rounded-full border border-nile-blue/20 hover:bg-nile-blue hover:text-white transition-colors"
            disabled={isLoading}
          >
            {suggestion.text}
          </button>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={itineraryContext
              ? "Tell me about your preferences for this trip..."
              : "Ask about planning your trip to Egypt..."}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nile-blue focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-nile-blue text-white p-2 rounded-full hover:bg-pharaoh-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
