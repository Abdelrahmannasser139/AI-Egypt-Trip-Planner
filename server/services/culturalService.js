import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const initGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  return new GoogleGenerativeAI(apiKey);
};

// Function to get cultural insights about Egypt
export const getCulturalInsights = async (topic) => {
  try {
    // Create a prompt for Gemini
    const prompt = `
    Provide detailed cultural insights about Egypt on the topic of "${topic}".
    
    Include information about:
    1. Historical context and significance
    2. Cultural practices and traditions
    3. Modern relevance and how it's experienced today
    4. Interesting facts that travelers should know
    5. Tips for respectful engagement with this aspect of Egyptian culture
    
    FORMAT THE RESPONSE AS A JSON OBJECT with the following structure:
    {
      "title": "Title for this cultural insight",
      "overview": "Brief overview of the topic",
      "historicalContext": "Historical context and significance",
      "culturalPractices": "Cultural practices and traditions",
      "modernRelevance": "How it's experienced in modern Egypt",
      "interestingFacts": [
        "Interesting fact 1",
        "Interesting fact 2",
        "Interesting fact 3"
      ],
      "tipsForTravelers": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "relatedTopics": [
        "Related topic 1",
        "Related topic 2",
        "Related topic 3"
      ]
    }
    
    IMPORTANT: Ensure all JSON is properly formatted and valid. Provide accurate, culturally sensitive information.
    `;

    // Initialize Gemini API
    const genAI = initGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Generate cultural insights
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response as JSON
    try {
      const parsedInsights = JSON.parse(response);
      return parsedInsights;
    } catch (error) {
      console.error('Error parsing Gemini response as JSON:', error);
      // Return the raw text if parsing fails
      return { 
        error: 'Failed to parse cultural insights as JSON',
        raw: response 
      };
    }
  } catch (error) {
    console.error('Error getting cultural insights:', error);
    throw error;
  }
};

// Function to answer a specific question about Egyptian culture
export const answerCulturalQuestion = async (question) => {
  try {
    // Create a prompt for Gemini
    const prompt = `
    Answer the following question about Egyptian culture, history, or customs:
    
    QUESTION:
    "${question}"
    
    Provide a detailed, accurate, and culturally sensitive answer. Include historical context where relevant and practical information for travelers.
    
    FORMAT THE RESPONSE AS A JSON OBJECT with the following structure:
    {
      "question": "The original question",
      "answer": "Detailed answer to the question",
      "additionalContext": "Additional context or background information",
      "tipsForTravelers": [
        "Relevant tip 1",
        "Relevant tip 2"
      ],
      "relatedTopics": [
        "Related topic 1",
        "Related topic 2"
      ]
    }
    
    IMPORTANT: Ensure all JSON is properly formatted and valid. If you're uncertain about any information, acknowledge the limitations of your knowledge rather than providing potentially incorrect information.
    `;

    // Initialize Gemini API
    const genAI = initGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Generate answer
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response as JSON
    try {
      const parsedAnswer = JSON.parse(response);
      return parsedAnswer;
    } catch (error) {
      console.error('Error parsing Gemini response as JSON:', error);
      // Return the raw text if parsing fails
      return { 
        error: 'Failed to parse answer as JSON',
        raw: response 
      };
    }
  } catch (error) {
    console.error('Error answering cultural question:', error);
    throw error;
  }
};

// Function to generate a list of cultural topics about Egypt
export const getCulturalTopics = async () => {
  try {
    // Create a prompt for Gemini
    const prompt = `
    Generate a comprehensive list of cultural topics about Egypt that would be interesting and useful for travelers.
    
    Include topics related to:
    1. Ancient Egyptian history and civilization
    2. Modern Egyptian culture and society
    3. Egyptian art, music, and literature
    4. Egyptian cuisine and food culture
    5. Religious practices and traditions
    6. Festivals and celebrations
    7. Etiquette and social customs
    8. Language and communication
    
    FORMAT THE RESPONSE AS A JSON ARRAY of topic objects with the following structure:
    [
      {
        "id": "unique-id-1",
        "title": "Topic title",
        "category": "Category (e.g., 'History', 'Food', 'Religion', etc.)",
        "description": "Brief description of the topic",
        "relevanceForTravelers": "Why this topic is relevant for travelers to Egypt"
      },
      // More topics...
    ]
    
    IMPORTANT: Ensure all JSON is properly formatted and valid. Provide at least 20 diverse topics covering different aspects of Egyptian culture.
    `;

    // Initialize Gemini API
    const genAI = initGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    });

    // Generate topics
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Parse the response as JSON
    try {
      const parsedTopics = JSON.parse(response);
      return parsedTopics;
    } catch (error) {
      console.error('Error parsing Gemini response as JSON:', error);
      // Return the raw text if parsing fails
      return { 
        error: 'Failed to parse topics as JSON',
        raw: response 
      };
    }
  } catch (error) {
    console.error('Error getting cultural topics:', error);
    throw error;
  }
};
