# Ray7 Masr

A comprehensive web application to assist tourists in planning trips to Egypt, featuring destination exploration, personalized itineraries, cultural insights, and community engagement.

## Features

- **User Authentication and Profiles**: Email/password and social media login, profile management
- **Destination Exploration**: Searchable database of Egyptian destinations with descriptions, images, and reviews
- **Itinerary Planner**: Custom itineraries with intelligent recommendations using Gemini API
- **Cultural and Historical Insights**: Articles, videos, and timelines on Egypt's history and culture
- **Community Features**: User reviews, forum discussions, and social sharing
- **Responsive Design**: Compatible with desktops, tablets, and smartphones
- **Gemini API and RAG Integration**: AI-powered planning and information retrieval

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js/Express.js with RESTful APIs
- **Database**: PostgreSQL for structured data, Pinecone for vector database (RAG)
- **Authentication**: JWT with OAuth for social logins
- **Maps**: Google Maps API integration
- **AI**: Gemini API with Retrieval-Augmented Generation (RAG)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL
- Pinecone account
- Gemini API key
- Google Maps API key
- OAuth credentials (Google, Facebook)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/pharaohs-compass.git
   cd pharaohs-compass
   ```

2. Install dependencies:
   ```
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Add necessary API keys and configuration

4. Set up the database:
   ```
   # Run PostgreSQL migrations
   cd server
   npm run migrate
   ```

5. Start the development servers:
   ```
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm run dev
   ```

## Project Structure

```
ray7-masr/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── components/     # Reusable UI components
│       │   ├── auth/       # Authentication components
│       │   ├── chatbot/    # AI chatbot components
│       │   ├── common/     # Common UI components
│       │   └── navigation/ # Navigation components
│       ├── pages/          # Page components
│       │   ├── auth/       # Authentication pages
│       │   ├── cultural/   # Cultural insights pages
│       │   ├── destinations/# Destination pages
│       │   ├── itinerary/  # Itinerary planning pages
│       │   └── profile/    # User profile pages
│       ├── context/        # React context providers
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API service functions
│       ├── utils/          # Utility functions
│       ├── assets/         # Static assets
│       └── styles/         # Global styles
├── server/                 # Backend Node.js/Express application
│   └── src/                # Source code
│       ├── controllers/    # Request handlers
│       ├── routes/         # API routes
│       ├── models/         # Database models
│       ├── middleware/     # Express middleware
│       ├── services/       # Business logic
│       ├── utils/          # Utility functions
│       ├── config/         # Configuration files
│       └── db/             # Database setup and migrations
├── egypt-trip-planner/     # Standalone chatbot application
│   ├── public/             # Static files
│   └── src/                # Source code
│       ├── data/           # Egyptian sites and restaurants datasets
│       ├── routes/         # API routes
│       └── services/       # AI services
└── README.md               # Project documentation
```

## Gemini API and RAG Implementation

The application uses the Gemini API with Retrieval-Augmented Generation (RAG) to provide intelligent recommendations and answer user queries. The implementation involves:

1. Storing destination data, cultural information, and user reviews in a vector database (Pinecone)
2. Converting user queries into vector embeddings
3. Retrieving relevant information from the vector database
4. Using the Gemini API to generate accurate and contextually relevant responses

### Key AI Features

- **Smart Chatbot**: Get instant answers to your travel questions with our Gemini-powered chatbot
- **Personalized Itinerary Generation**: AI creates custom travel plans based on your preferences, interests, and budget
- **Cultural Insights**: AI-generated explanations of Egyptian history, customs, and traditions
- **Content Moderation**: AI-powered moderation of user-generated content in the community forum

### Datasets

- **Egyptian Sites Dataset**: Contains detailed information about major tourist attractions in Egypt, including visiting hours, entrance fees, historical significance, and visitor tips
- **Egyptian Restaurants Dataset**: Provides information about authentic Egyptian restaurants, their locations, cuisine types, signature dishes, and price ranges
- **Keyword-Based Retrieval**: The system analyzes user queries for relevant keywords and retrieves the most pertinent information from the datasets

## Deployment

The application can be deployed on cloud platforms such as AWS, Google Cloud, or Vercel. Detailed deployment instructions are available in the [Deployment Guide](./docs/deployment.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
