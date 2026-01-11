![GitHub repo size](https://img.shields.io/github/repo-size/Abdelrahmannasser139/AI-Egypt-Trip-Planner)
![GitHub contributors](https://img.shields.io/github/contributors/Abdelrahmannasser139/AI-Egypt-Trip-Planner)
![GitHub language count](https://img.shields.io/github/languages/count/Abdelrahmannasser139/AI-Egypt-Trip-Planner)
![GitHub top language](https://img.shields.io/github/languages/top/Abdelrahmannasser139/AI-Egypt-Trip-Planner)

<div align="center">
  <h1>🌍 Ray7 Masr – AI-Powered Egypt Trip Planner</h1>
</div>

**Ray7 Masr** is a comprehensive web application that helps tourists plan unforgettable trips to Egypt.  
It combines **AI-driven recommendations**, rich cultural insights, and community features to deliver personalized travel experiences.

<br>

## 🚀 Features

- **User Authentication & Profiles**  
  Sign up with email/password or social login (Google/Facebook) • Manage preferences & itineraries

- **Destination Exploration**  
  Browse & search Egyptian destinations with photos, descriptions, and real user reviews

- **AI-Powered Itinerary Planner**  
  Generate custom travel plans based on your interests, budget, duration and travel style  
  (Powered by **Gemini API + RAG**)

- **Cultural & Historical Insights**  
  Learn about Egypt's history, traditions, etiquette, and must-know facts

- **Community & Social Features**  
  Write reviews • Join discussions • Share travel photos & stories

- **Fully Responsive Design**  
  Beautiful experience on mobile, tablet, and desktop

- **Smart AI Integration**  
  Gemini API + Retrieval-Augmented Generation (RAG) for contextual & accurate recommendations

<br>

## 🛠 Tech Stack

| Layer          | Technologies                                      |
|----------------|---------------------------------------------------|
| **Frontend**   | React.js • Tailwind CSS                           |
| **Backend**    | Node.js • Express.js • RESTful APIs               |
| **Database**   | PostgreSQL (main) • Pinecone (vector DB for RAG)  |
| **Auth**       | JWT + OAuth 2.0 (Google, Facebook)                |
| **Maps**       | Google Maps API                                   |
| **AI**         | Google Gemini API + Retrieval-Augmented Generation|
| **Others**     | Vite, React Router, Axios, Drizzle (ORM), etc.    |

<br>

## ⚡ Quick Start

### Prerequisites
- Node.js v16+
- PostgreSQL
- Pinecone account
- Gemini API key
- Google Maps API key
- Google & Facebook OAuth credentials

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abdelrahmannasser139/AI-Egypt-Trip-Planner.git
cd AI-Egypt-Trip-Planner

# 2. Install frontend dependencies
cd client
npm install

# 3. Install backend dependencies
cd ../server
npm install

# 4. Create .env files in both client & server folders
#    Copy values from .env.example and add your keys

# 5. Run database migrations (from server folder)
npm run migrate

# 6. Start development servers

# Backend (in server folder)
npm run dev

# Frontend (in another terminal, from client folder)
npm run dev


🤖 AI Implementation Highlights

Egyptian attractions, restaurants & cultural content stored in Pinecone vector database
Semantic search + keyword fallback
Context-aware responses using Gemini API
Generates complete personalized itineraries
Smart travel chatbot
Automated content moderation for community posts



📂 Project Structure
textAI-Egypt-Trip-Planner/
├── client/                 # React + Vite + Tailwind frontend
├── server/                 # Node.js + Express backend
├── egypt-trip-planner/     # Standalone AI chatbot version (optional)
└── README.md


🚀 Deployment
Ready to deploy on:

Vercel (frontend)
Render / Railway / Fly.io (backend)
AWS / Google Cloud / DigitalOcean

Detailed guide → docs/deployment.md


📄 License
MIT License – see the LICENSE file for details.


  Happy travels in the land of the Pharaohs! 🇪🇬✨
  Don't forget to ⭐ the repo if you find it useful!

```
