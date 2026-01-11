# Ray7 Masr — AI-Powered Egypt Trip Planner (رايح مصر)

[![Repo Size](https://img.shields.io/github/repo-size/Abdelrahmannasser139/AI-Egypt-Trip-Planner)](https://github.com/Abdelrahmannasser139/AI-Egypt-Trip-Planner)
[![Issues](https://img.shields.io/github/issues/Abdelrahmannasser139/AI-Egypt-Trip-Planner)](https://github.com/Abdelrahmannasser139/AI-Egypt-Trip-Planner/issues)
[![Stars](https://img.shields.io/github/stars/Abdelrahmannasser139/AI-Egypt-Trip-Planner)](https://github.com/Abdelrahmannasser139/AI-Egypt-Trip-Planner/stargazers)

A modern web application that helps travelers plan unforgettable trips to Egypt using AI-driven recommendations, cultural insights, interactive maps, and a retrieval-augmented chatbot.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database & Vector DB Initialization](#database--vector-db-initialization)
  - [Run (Development)](#run-development)
- [Project Structure](#project-structure)
- [AI & RAG Implementation](#ai--rag-implementation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Bug Reports & Feature Requests](#bug-reports--feature-requests)
- [Contact](#acknowledgments--contact)

---

## About

**Ray7 Masr (رايح مصر)** — *"Going to Egypt"* — is an AI-assisted trip planner focusing on Egyptian attractions, culture, cuisine, and logistics. The app combines:

- A recommendation engine (Gemini API + RAG)
- A contextual chatbot for travel questions
- Interactive maps and itineraries
- Community reviews and content moderation

---

## Features

- User authentication, profiles, and preferences (email/password + OAuth)
- Destination browsing with photos, maps and reviews
- AI-powered personalized itinerary generation (Gemini API + RAG)
- Context-aware chatbot backed by a vector database (Pinecone)
- Cultural & historical content (timelines, articles, language tips)
- Community features: reviews, forums and sharing
- Responsive UI and PWA-ready frontend
- Moderation: automated content checks, sentiment analysis

---

## 🖼️ Screenshots

### Home Page
![Home Page](assets/home.png)

### AI Chatbot
![AI Chatbot](assets/chatbot.png)

---


## Tech Stack

Frontend
- React 18.x, React Router
- Tailwind CSS
- React Context / Redux
- Google Maps JavaScript API
- Axios

Backend
- Node.js (v16+), Express
- JWT + bcrypt for auth, plus OAuth (Google / Facebook)
- Multer for file uploads
- PostgreSQL (v14+) — relational data
- Pinecone — vector store for embeddings + RAG
- ORM: Sequelize or Prisma
- Redis (optional, caching)

AI / ML
- Gemini API (LLM)
- RAG using Pinecone and embeddings
- Custom datasets for Egyptian sites, restaurants, cultural data

DevOps
- Git & GitHub
- GitHub Actions (CI/CD)
- Docker (optional)
- Hosting: Vercel / AWS / Google Cloud

---

## Getting Started

### Prerequisites

- Node.js v16+ and npm (or yarn)
- PostgreSQL v14+
- Git
- Pinecone account & API key
- Gemini API key
- Google Maps API key
- OAuth credentials (Google & Facebook) if enabling social login

### Installation

1. Clone the repository

```bash
git clone https://github.com/Abdelrahmannasser139/AI-Egypt-Trip-Planner.git
cd AI-Egypt-Trip-Planner
```

2. Install dependencies

Frontend:

```bash
cd client
npm install
# or
# yarn install
```

Backend:

```bash
cd ../server
npm install
# or
# yarn install
```

### Environment Configuration

Create .env files for server and client. Below are example variables — update values to your credentials.

server/.env:

```env
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/ray7masr
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENV=your_pinecone_env

# Gemini or other LLM provider
GEMINI_API_KEY=your_gemini_api_key

# OAuth credentials
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
FACEBOOK_CLIENT_ID=your_fb_id
FACEBOOK_CLIENT_SECRET=your_fb_secret
```

client/.env:

```env
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

> Keep secrets out of source control. Use environment variables or secrets manager in production.

### Database & Vector DB Initialization

1. Create PostgreSQL DB and run migrations (example using npm scripts or ORM CLI).
   Example for Prisma:

```bash
# from server directory
npx prisma migrate dev --name init
npx prisma db seed
```

2. Initialize Pinecone index and upload embeddings for your datasets. Example (pseudo):

```bash
# Example script (replace with real script)
node scripts/init-pinecone.js --index ray7masr
node scripts/upload-embeddings.js --source ./data
```

Add scripts in package.json to automate these steps as needed.

### Run (Development)

Start backend:

```bash
cd server
npm run dev
# or
# nodemon src/index.js
```

Start frontend:

```bash
cd client
npm run dev
# visit http://localhost:3000 (or as configured)
```

---

## Project Structure

A high-level overview:

```
/client         # React app
/server         # Express API + business logic
/scripts        # utility scripts (seed, migrations, embeddings)
/docs           # documentation (API, RAG, deployment)
/data           # datasets (sites, restaurants, culture)
/docker         # Docker compose and Dockerfiles (optional)
```

---

## AI & RAG Implementation

Ray7 Masr uses Retrieval-Augmented Generation to ground LLM responses in curated local datasets:

- Embeddings are generated for destination data, reviews, and cultural content.
- Pinecone stores and indexes embeddings for fast semantic retrieval.
- For chatbot or itinerary generation, the app retrieves the most relevant documents (context) and supplies them to the LLM (Gemini) to produce factual, localized responses.
- Additional modules include:
  - Embedding generation and indexing
  - Context selection and prompt templating
  - Safety & content moderation before returning content to users

For implementation details see: ./docs/RAG.md

---

## Testing

Run unit and integration tests (example):

```bash
# server
cd server
npm test

# client
cd ../client
npm test
```

Add and maintain test coverage for critical modules: authentication, itinerary generation, RAG retrieval, and API contracts.

---

## Deployment

Production build examples:

Frontend (Vercel / static hosting):

```bash
cd client
npm run build
# deploy build/ to Vercel, Netlify, S3 + CloudFront, etc.
```

Backend (Docker + Cloud):

- Build Docker image and push to container registry
- Use managed DB (RDS / Cloud SQL)
- Store secrets in secrets manager
- Use a job queue for heavy tasks (embedding generation, long-running RAG indexing)

See ./docs/DEPLOYMENT.md for step-by-step instructions and sample GitHub Actions workflows.

---

## Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m "Add: short description"`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

Please read: ./docs/CONTRIBUTING.md for contribution guidelines and code standards.

---

## Bug Reports & Feature Requests

Found a bug or have an idea? Open an issue:

- Report a bug: https://github.com/Abdelrahmannasser139/AI-Egypt-Trip-Planner/issues/new?template=bug_report.md
- Request a feature: https://github.com/Abdelrahmannasser139/AI-Egypt-Trip-Planner/issues/new?template=feature_request.md

If the templates don't exist, use a regular issue and label it appropriately.

---

## Contact:  
- **GitHub:** [https://github.com/Abdelrahmannasser139](https://github.com/Abdelrahmannasser139)  
- **Email:** [Abdelrahmanasser139@gmail.com](mailto:Abdelrahmanasser139@gmail.com)  
- **Portfolio:** [https://abdelrahmannasser139.github.io/portfolio/](https://abdelrahmannasser139.github.io/portfolio/)  
- **LinkedIn:** [https://www.linkedin.com/in/abdelrahman-nasser139](https://www.linkedin.com/in/abdelrahman-nasser139)

---

Made with ❤️ for Egypt — If you find this project useful, please give it a star!
