🏛️ Ray7 Masr (رايح مصر)
<div align="center">
Show Image
Show Image
Show Image
Show Image
Show Image
Your intelligent companion for exploring the wonders of Egypt
Features • Demo • Getting Started • Documentation • Contributing
</div>

📖 About
Ray7 Masr (رايح مصر - "Going to Egypt") is a comprehensive AI-powered web application designed to help tourists plan unforgettable trips to Egypt. Leveraging the power of Google's Gemini API and Retrieval-Augmented Generation (RAG), the platform provides personalized itineraries, cultural insights, and intelligent recommendations to make your Egyptian adventure seamless and enriching.
✨ Features
🔐 User Authentication & Profiles

Multiple Login Options: Email/password authentication and social media integration (Google, Facebook)
Profile Management: Customize your travel preferences, save favorite destinations, and track your journey
Secure Authentication: JWT-based authentication with OAuth 2.0 support

🗺️ Destination Exploration

Comprehensive Database: Explore hundreds of Egyptian landmarks, from ancient pyramids to modern attractions
Rich Media Content: High-quality images, detailed descriptions, and historical context
Interactive Maps: Google Maps integration for location visualization and navigation
User Reviews & Ratings: Community-driven insights and recommendations

📅 AI-Powered Itinerary Planner

Personalized Planning: Custom itineraries based on your interests, budget, and time constraints
Intelligent Recommendations: Gemini API suggests optimal routes and timing
Flexible Scheduling: Drag-and-drop interface for easy itinerary adjustments
Budget Tracking: Keep your expenses in check with built-in budget management

🏺 Cultural & Historical Insights

Interactive Timeline: Journey through 5,000 years of Egyptian history
Educational Articles: In-depth content on Egyptian culture, customs, and traditions
Video Content: Curated documentaries and virtual tours
Language Tips: Basic Arabic phrases and cultural etiquette guides

👥 Community Features

Discussion Forums: Connect with fellow travelers and share experiences
Review System: Rate and review destinations, restaurants, and tours
Social Sharing: Share your itineraries and memories on social media
AI Moderation: Gemini-powered content moderation for a safe community

🤖 AI Chatbot Assistant

24/7 Support: Get instant answers to your travel questions
Context-Aware Responses: RAG-powered chatbot with access to comprehensive Egyptian tourism data
Multi-Language Support: Communicate in your preferred language
Smart Suggestions: Proactive recommendations based on your conversation

📱 Responsive Design

Mobile-First: Optimized for smartphones and tablets
Cross-Platform: Works seamlessly on all devices and browsers
Progressive Web App: Install on your device for offline access

🛠️ Tech Stack
Frontend

Framework: React.js 18.x with React Router
Styling: Tailwind CSS for modern, responsive design
State Management: React Context API / Redux
Maps: Google Maps JavaScript API
HTTP Client: Axios for API communication

Backend

Runtime: Node.js (v16+)
Framework: Express.js
API Architecture: RESTful APIs with proper versioning
Authentication: JSON Web Tokens (JWT) with bcrypt
File Upload: Multer for image handling

Database & Storage

Relational Database: PostgreSQL 14+ for structured data
Vector Database: Pinecone for RAG implementation
ORM: Sequelize or Prisma
Caching: Redis (optional, for performance optimization)

AI & Machine Learning

LLM: Google Gemini API for intelligent responses
RAG: Retrieval-Augmented Generation with Pinecone
Embeddings: Text embeddings for semantic search
Datasets: Custom Egyptian tourism and restaurant databases

DevOps & Deployment

Version Control: Git & GitHub
CI/CD: GitHub Actions
Hosting: AWS, Google Cloud, or Vercel
Containerization: Docker (optional)

🚀 Getting Started
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v16 or higher)
npm or yarn
PostgreSQL (v14 or higher)
Git

You'll also need API keys for:

Google Gemini API
Pinecone
Google Maps API
OAuth credentials (Google, Facebook)

Installation

Clone the repository

bashgit clone https://github.com/yourusername/ray7-masr.git
cd ray7-masr

Install dependencies

Frontend:
bashcd client
npm install
Backend:
bashcd ../server
npm install

Configure environment variables

Create .env file in the server directory:
env# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ray7_masr

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=ray7-masr-index

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Frontend URL
CLIENT_URL=http://localhost:3000
Create .env file in the client directory:
envREACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

Set up the database

bashcd server

# Create database
npm run db:create

# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed

Initialize vector database

bashcd server
npm run setup:pinecone

Start the development servers

Terminal 1 (Backend):
bashcd server
npm run dev
Terminal 2 (Frontend):
bashcd client
npm start

Access the application

Open your browser and navigate to http://localhost:3000
📁 Project Structure
ray7-masr/
│
├── client/                      # Frontend React application
│   ├── public/
│   │   ├── index.html
│   │   └── assets/              # Static images, icons
│   └── src/
│       ├── components/
│       │   ├── auth/            # Login, Register, ProtectedRoute
│       │   ├── chatbot/         # AI chatbot components
│       │   ├── common/          # Button, Card, Modal, Loader
│       │   ├── navigation/      # Header, Footer, Sidebar
│       │   └── destinations/    # Destination cards, filters
│       ├── pages/
│       │   ├── auth/            # LoginPage, RegisterPage
│       │   ├── cultural/        # CulturalInsights, Timeline
│       │   ├── destinations/    # DestinationList, DestinationDetail
│       │   ├── itinerary/       # ItineraryPlanner, MyItineraries
│       │   ├── profile/         # ProfilePage, Settings
│       │   ├── community/       # Forum, Reviews
│       │   └── HomePage.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── ThemeContext.jsx
│       │   └── ItineraryContext.jsx
│       ├── hooks/
│       │   ├── useAuth.js
│       │   ├── useApi.js
│       │   └── useDebounce.js
│       ├── services/
│       │   ├── api.js           # Axios instance
│       │   ├── authService.js
│       │   ├── destinationService.js
│       │   └── itineraryService.js
│       ├── utils/
│       │   ├── validators.js
│       │   ├── formatters.js
│       │   └── constants.js
│       ├── assets/
│       ├── styles/
│       │   └── globals.css
│       ├── App.jsx
│       └── index.jsx
│
├── server/                      # Backend Node.js/Express application
│   └── src/
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── destinationController.js
│       │   ├── itineraryController.js
│       │   ├── chatbotController.js
│       │   └── userController.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── destination.routes.js
│       │   ├── itinerary.routes.js
│       │   ├── chatbot.routes.js
│       │   └── index.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Destination.js
│       │   ├── Itinerary.js
│       │   ├── Review.js
│       │   └── index.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   ├── validation.middleware.js
│       │   ├── error.middleware.js
│       │   └── upload.middleware.js
│       ├── services/
│       │   ├── gemini.service.js
│       │   ├── pinecone.service.js
│       │   ├── rag.service.js
│       │   └── email.service.js
│       ├── utils/
│       │   ├── ApiError.js
│       │   ├── asyncHandler.js
│       │   └── logger.js
│       ├── config/
│       │   ├── database.js
│       │   ├── gemini.js
│       │   ├── pinecone.js
│       │   └── oauth.js
│       ├── db/
│       │   ├── migrations/
│       │   └── seeders/
│       ├── app.js
│       └── server.js
│
├── egypt-trip-planner/          # Standalone chatbot application
│   ├── public/
│   └── src/
│       ├── data/
│       │   ├── egyptian_sites.json
│       │   └── egyptian_restaurants.json
│       ├── routes/
│       └── services/
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── LICENSE
├── package.json
└── README.md
🤖 AI & RAG Implementation
Architecture Overview
Ray7 Masr uses a sophisticated Retrieval-Augmented Generation (RAG) system to provide accurate, contextually relevant responses:
User Query → Embedding Generation → Vector Search (Pinecone) → Context Retrieval → Gemini API → Response
Key Components

Vector Database (Pinecone)

Stores embeddings of destinations, cultural information, and user reviews
Enables semantic search for relevant context
Indexed by categories: attractions, restaurants, history, customs


Gemini API Integration

Generates natural language responses
Creates personalized itineraries
Provides cultural insights and recommendations
Powers the intelligent chatbot


Custom Datasets

Egyptian Sites: 200+ major attractions with detailed metadata
Restaurants: 150+ authentic Egyptian dining locations
Cultural Content: Historical events, traditions, and customs
User-Generated: Reviews, ratings, and travel tips



AI Features in Detail
Smart Chatbot
javascript// Example interaction
User: "What's the best time to visit the Pyramids?"
AI: "The best time to visit the Pyramids of Giza is early morning 
     (7-9 AM) or late afternoon (3-5 PM) to avoid the intense 
     midday heat. Winter months (November-February) offer the most 
     comfortable temperatures. I can help you add this to your 
     itinerary with optimal timing!"
Personalized Itinerary Generation

Analyzes user preferences (budget, interests, duration)
Considers geographical proximity and travel time
Balances popular attractions with hidden gems
Incorporates meal breaks and rest periods
Adapts to constraints (accessibility, dietary restrictions)

Content Moderation

AI-powered detection of inappropriate content
Sentiment analysis for review authenticity
Spam and bot detection

📚 Documentation

API Documentation - Complete API reference
Deployment Guide - Production deployment instructions
Contributing Guide - How to contribute to the project
RAG Implementation - Technical details of the RAG system

🧪 Testing
bash# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
🚢 Deployment
Production Build
bash# Build frontend
cd client
npm run build

# The build folder is ready to be deployed
Deployment Options

Vercel: Frontend deployment with automatic CI/CD
Heroku: Full-stack deployment with PostgreSQL add-on
AWS: EC2 for backend, S3 for static assets, RDS for PostgreSQL
Google Cloud: App Engine or Cloud Run with Cloud SQL

See Deployment Guide for detailed instructions.
🤝 Contributing
We welcome contributions from the community! Here's how you can help:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

Please read CONTRIBUTING.md for details on our code of conduct and development process.
🐛 Bug Reports & Feature Requests
Found a bug or have a feature idea? Please open an issue on GitHub:

Report a Bug
Request a Feature

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
👏 Acknowledgments

Egyptian Ministry of Tourism for destination data
Google Gemini team for AI capabilities
Pinecone for vector database infrastructure
The open-source community for incredible tools and libraries

📞 Contact & Support

Website: ray7masr.com
Email: support@ray7masr.com
Twitter: @Ray7Masr
Discord: Join our community


<div align="center">
Made with ❤️ for Egypt
⭐ Star us on GitHub — it motivates us a lot!
🏠 Homepage • 📖 Documentation • 🐛 Report Bug • 💡 Request Feature
</div>
