🌍 Ray7 Masr – AI-Powered Egypt Trip Planner
============================================

**Ray7 Masr** (رايح مصر - "Going to Egypt") is a comprehensive web application that helps tourists plan unforgettable trips to Egypt. It combines AI-driven recommendations, cultural insights, and community engagement to provide personalized, memorable travel experiences powered by Google's Gemini API and Retrieval-Augmented Generation (RAG).

🚀 Features
-----------

*   **User Authentication & Profiles**Sign up via email/password or social media (Google, Facebook); manage personal travel preferences, save favorite destinations, and track your journey.
    
*   **Destination Exploration**Browse and search hundreds of Egyptian destinations with rich descriptions, high-quality photos, interactive maps, and authentic user reviews.
    
*   **AI-Powered Itinerary Planner**Generate personalized itineraries based on your preferences, interests, budget, and travel duration using **Gemini API + RAG**. Get intelligent recommendations for routes, timing, and activities.
    
*   **Cultural & Historical Insights**Access educational articles, curated videos, interactive timelines, and language tips to learn about Egypt's 5,000-year history, culture, customs, and landmarks.
    
*   **Community & Social Features**Post reviews, engage in discussion forums, share your itineraries on social media, and connect with fellow travelers. AI-powered content moderation ensures a safe environment.
    
*   **AI Chatbot Assistant**Get instant 24/7 answers to your travel questions with our context-aware, RAG-powered chatbot that provides smart suggestions and recommendations.
    
*   **Responsive Design**Fully optimized for desktop, tablet, and mobile devices with a mobile-first approach and progressive web app capabilities.
    
*   **Gemini API + RAG Integration**Smart AI recommendations, personalized itinerary generation, and retrieval of contextual travel information from comprehensive Egyptian tourism databases.
    

🛠 Tech Stack
-------------

### Frontend

*   **Framework:** React.js 18.x with React Router
    
*   **Styling:** Tailwind CSS for modern, responsive design
    
*   **State Management:** React Context API / Redux
    
*   **Maps:** Google Maps JavaScript API
    
*   **HTTP Client:** Axios
    

### Backend

*   **Runtime:** Node.js (v16+)
    
*   **Framework:** Express.js with RESTful APIs
    
*   **Authentication:** JWT with bcrypt + OAuth 2.0 (Google, Facebook)
    
*   **File Upload:** Multer for image handling
    

### Database & Storage

*   **Relational Database:** PostgreSQL 14+ for structured data
    
*   **Vector Database:** Pinecone for RAG implementation
    
*   **ORM:** Sequelize or Prisma
    
*   **Caching:** Redis (optional, for performance)
    

### AI & Machine Learning

*   **LLM:** Gemini API for intelligent responses
    
*   **RAG:** Retrieval-Augmented Generation with Pinecone
    
*   **Embeddings:** Text embeddings for semantic search
    
*   **Datasets:** Custom Egyptian tourism and restaurant databases
    

### DevOps

*   **Version Control:** Git & GitHub
    
*   **CI/CD:** GitHub Actions
    
*   **Hosting:** AWS, Google Cloud, or Vercel
    
*   **Containerization:** Docker (optional)
    

⚡ Getting Started
-----------------

### Prerequisites

*   **Node.js** (v16 or higher)
    
*   **npm** or **yarn**
    
*   **PostgreSQL** (v14 or higher)
    
*   **Git**
    
*   **Pinecone account**
    
*   **Gemini API key**
    
*   **Google Maps API key**
    
*   **OAuth credentials** (Google, Facebook)
    

### Installation

1.  **Clone the repository**
    

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/yourusername/ray7-masr.git  cd ray7-masr   `

1.  **Install dependencies**
    

Frontend:

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd client  npm install   `

Backend:

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd ../server  npm install   `

1.  **Configure environment variables**
    

Create .env file in the server directory:

env

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Server Configuration  PORT=5000  NODE_ENV=development  # Database  DATABASE_URL=postgresql://username:password@localhost:5432/ray7_masr  # JWT  JWT_SECRET=your_jwt_secret_key_here  JWT_EXPIRE=7d  # Google Gemini API  GEMINI_API_KEY=your_gemini_api_key_here  # Pinecone  PINECONE_API_KEY=your_pinecone_api_key_here  PINECONE_ENVIRONMENT=your_pinecone_environment  PINECONE_INDEX_NAME=ray7-masr-index  # Google Maps  GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here  # OAuth  GOOGLE_CLIENT_ID=your_google_client_id  GOOGLE_CLIENT_SECRET=your_google_client_secret  FACEBOOK_APP_ID=your_facebook_app_id  FACEBOOK_APP_SECRET=your_facebook_app_secret  # Frontend URL  CLIENT_URL=http://localhost:3000   `

Create .env file in the client directory:

env

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   REACT_APP_API_URL=http://localhost:5000/api  REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here   `

1.  **Set up the database**
    

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd server  # Create database  npm run db:create  # Run migrations  npm run db:migrate  # Seed initial data (optional)  npm run db:seed   `

1.  **Initialize vector database**
    

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd server  npm run setup:pinecone   `

1.  **Start the development servers**
    

Terminal 1 - Backend:

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd server  npm run dev   `

Terminal 2 - Frontend:

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd client  npm start   `

1.  **Access the application**Open your browser and navigate to http://localhost:3000
    

📁 Project Structure
--------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ray7-masr/  │  ├── client/                      # Frontend React application  │   ├── public/  │   │   ├── index.html  │   │   └── assets/              # Static images, icons  │   └── src/  │       ├── components/  │       │   ├── auth/            # Login, Register, ProtectedRoute  │       │   ├── chatbot/         # AI chatbot components  │       │   ├── common/          # Button, Card, Modal, Loader  │       │   ├── navigation/      # Header, Footer, Sidebar  │       │   └── destinations/    # Destination cards, filters  │       ├── pages/  │       │   ├── auth/            # LoginPage, RegisterPage  │       │   ├── cultural/        # CulturalInsights, Timeline  │       │   ├── destinations/    # DestinationList, DestinationDetail  │       │   ├── itinerary/       # ItineraryPlanner, MyItineraries  │       │   ├── profile/         # ProfilePage, Settings  │       │   ├── community/       # Forum, Reviews  │       │   └── HomePage.jsx  │       ├── context/  │       │   ├── AuthContext.jsx  │       │   ├── ThemeContext.jsx  │       │   └── ItineraryContext.jsx  │       ├── hooks/  │       │   ├── useAuth.js  │       │   ├── useApi.js  │       │   └── useDebounce.js  │       ├── services/  │       │   ├── api.js           # Axios instance  │       │   ├── authService.js  │       │   ├── destinationService.js  │       │   └── itineraryService.js  │       ├── utils/  │       │   ├── validators.js  │       │   ├── formatters.js  │       │   └── constants.js  │       ├── assets/  │       ├── styles/  │       │   └── globals.css  │       ├── App.jsx  │       └── index.jsx  │  ├── server/                      # Backend Node.js/Express application  │   └── src/  │       ├── controllers/  │       │   ├── authController.js  │       │   ├── destinationController.js  │       │   ├── itineraryController.js  │       │   ├── chatbotController.js  │       │   └── userController.js  │       ├── routes/  │       │   ├── auth.routes.js  │       │   ├── destination.routes.js  │       │   ├── itinerary.routes.js  │       │   ├── chatbot.routes.js  │       │   └── index.js  │       ├── models/  │       │   ├── User.js  │       │   ├── Destination.js  │       │   ├── Itinerary.js  │       │   ├── Review.js  │       │   └── index.js  │       ├── middleware/  │       │   ├── auth.middleware.js  │       │   ├── validation.middleware.js  │       │   ├── error.middleware.js  │       │   └── upload.middleware.js  │       ├── services/  │       │   ├── gemini.service.js  │       │   ├── pinecone.service.js  │       │   ├── rag.service.js  │       │   └── email.service.js  │       ├── utils/  │       │   ├── ApiError.js  │       │   ├── asyncHandler.js  │       │   └── logger.js  │       ├── config/  │       │   ├── database.js  │       │   ├── gemini.js  │       │   ├── pinecone.js  │       │   └── oauth.js  │       ├── db/  │       │   ├── migrations/  │       │   └── seeders/  │       ├── app.js  │       └── server.js  │  ├── egypt-trip-planner/          # Standalone chatbot application  │   ├── public/  │   └── src/  │       ├── data/  │       │   ├── egyptian_sites.json  │       │   └── egyptian_restaurants.json  │       ├── routes/  │       └── services/  │  ├── docs/                        # Documentation  │   ├── API.md  │   ├── DEPLOYMENT.md  │   └── CONTRIBUTING.md  │  ├── .gitignore  ├── LICENSE  ├── package.json  └── README.md   `

🤖 AI & RAG Implementation
--------------------------

### Architecture Overview

Ray7 Masr uses a sophisticated Retrieval-Augmented Generation (RAG) system to provide accurate, contextually relevant responses:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Query → Embedding Generation → Vector Search (Pinecone) → Context Retrieval → Gemini API → Response   `

### Key Components

**1\. Vector Database (Pinecone)**

*   Stores embeddings of destinations, cultural information, and user reviews
    
*   Enables semantic search for relevant context
    
*   Indexed by categories: attractions, restaurants, history, customs
    

**2\. Gemini API Integration**

*   Generates natural language responses
    
*   Creates personalized itineraries
    
*   Provides cultural insights and recommendations
    
*   Powers the intelligent chatbot
    

**3\. Custom Datasets**

*   **Egyptian Sites:** 200+ major attractions with detailed metadata
    
*   **Restaurants:** 150+ authentic Egyptian dining locations
    
*   **Cultural Content:** Historical events, traditions, and customs
    
*   **User-Generated:** Reviews, ratings, and travel tips
    

### AI Features in Detail

**Smart Chatbot**

javascript

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   // Example interaction  User: "What's the best time to visit the Pyramids?"  AI: "The best time to visit the Pyramids of Giza is early morning        (7-9 AM) or late afternoon (3-5 PM) to avoid the intense        midday heat. Winter months (November-February) offer the most        comfortable temperatures. I can help you add this to your        itinerary with optimal timing!"   `

**Personalized Itinerary Generation**

*   Analyzes user preferences (budget, interests, duration)
    
*   Considers geographical proximity and travel time
    
*   Balances popular attractions with hidden gems
    
*   Incorporates meal breaks and rest periods
    
*   Adapts to constraints (accessibility, dietary restrictions)
    

**Content Moderation**

*   AI-powered detection of inappropriate content
    
*   Sentiment analysis for review authenticity
    
*   Spam and bot detection
    

📚 Documentation
----------------

*   [**API Documentation**](./docs/API.md) – Complete API reference
    
*   [**Deployment Guide**](./docs/DEPLOYMENT.md) – Production deployment instructions
    
*   [**Contributing Guide**](./docs/CONTRIBUTING.md) – How to contribute to the project
    
*   [**RAG Implementation**](./docs/RAG.md) – Technical details of the RAG system
    

🧪 Testing
----------

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Run backend tests  cd server  npm test  # Run frontend tests  cd client  npm test  # Run e2e tests  npm run test:e2e  # Generate coverage report  npm run test:coverage   `

🚢 Deployment
-------------

### Production Build

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Build frontend  cd client  npm run build  # The build folder is ready to be deployed   `

### Deployment Options

*   **Vercel:** Frontend deployment with automatic CI/CD
    
*   **Heroku:** Full-stack deployment with PostgreSQL add-on
    
*   **AWS:** EC2 for backend, S3 for static assets, RDS for PostgreSQL
    
*   **Google Cloud:** App Engine or Cloud Run with Cloud SQL
    

See [**Deployment Guide**](./docs/DEPLOYMENT.md) for detailed instructions.

🤝 Contributing
---------------

We welcome contributions from the community! Here's how you can help:

1.  Fork the repository
    
2.  Create a feature branch (git checkout -b feature/AmazingFeature)
    
3.  Commit your changes (git commit -m 'Add some AmazingFeature')
    
4.  Push to the branch (git push origin feature/AmazingFeature)
    
5.  Open a Pull Request
    

Please read [**CONTRIBUTING.md**](./docs/CONTRIBUTING.md) for details on our code of conduct and development process.

🐛 Bug Reports & Feature Requests
---------------------------------

Found a bug or have a feature idea? Please open an issue on GitHub:

*   [**Report a Bug**](https://github.com/yourusername/ray7-masr/issues/new?template=bug_report.md)
    
*   [**Request a Feature**](https://github.com/yourusername/ray7-masr/issues/new?template=feature_request.md)
    

📄 License
----------

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

👏 Acknowledgments
------------------

*   Egyptian Ministry of Tourism for destination data
    
*   Google Gemini team for AI capabilities
    
*   Pinecone for vector database infrastructure
    
*   The open-source community for incredible tools and libraries
    

📞 Contact & Support
--------------------

*   **Website:** [ray7masr.com](https://ray7masr.com)
    
*   **Email:** [support@ray7masr.com](mailto:support@ray7masr.com)
    
*   **Twitter:** [@Ray7Masr](https://twitter.com/ray7masr)
    
*   **Discord:** [Join our community](https://discord.gg/ray7masr)
    

**Made with ❤️ for Egypt**

⭐ **Star us on GitHub — it motivates us a lot!**

[🏠 Homepage](https://ray7masr.com) • [📖 Documentation](./docs) • [🐛 Report Bug](https://github.com/yourusername/ray7-masr/issues) • [💡 Request Feature](https://github.com/yourusername/ray7-masr/issues)
