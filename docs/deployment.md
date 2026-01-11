# Deployment Guide for Pharaoh's Compass

This guide provides instructions for deploying the Pharaoh's Compass application to various cloud platforms.

## Prerequisites

Before deploying, ensure you have the following:

1. Node.js (v16 or higher) and npm installed
2. PostgreSQL database set up
3. Pinecone vector database account
4. Gemini API key
5. Google Maps API key
6. OAuth credentials (Google, Facebook)
7. Git installed

## Environment Variables

Create a `.env` file in both the client and server directories with the necessary environment variables. Use the `.env.example` files as templates.

## Deployment Options

### Option 1: Vercel (Frontend) + Heroku (Backend)

#### Frontend Deployment (Vercel)

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Navigate to the client directory:
   ```
   cd client
   ```
4. Deploy to Vercel:
   ```
   vercel
   ```
5. Follow the prompts to complete the deployment

#### Backend Deployment (Heroku)

1. Create a Heroku account at [heroku.com](https://heroku.com)
2. Install the Heroku CLI:
   ```
   npm install -g heroku
   ```
3. Login to Heroku:
   ```
   heroku login
   ```
4. Navigate to the server directory:
   ```
   cd server
   ```
5. Create a Heroku app:
   ```
   heroku create pharaohs-compass-api
   ```
6. Add PostgreSQL add-on:
   ```
   heroku addons:create heroku-postgresql:hobby-dev
   ```
7. Set environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set JWT_EXPIRES_IN=7d
   heroku config:set GEMINI_API_KEY=your_gemini_api_key
   heroku config:set PINECONE_API_KEY=your_pinecone_api_key
   heroku config:set PINECONE_ENVIRONMENT=your_pinecone_environment
   heroku config:set PINECONE_INDEX=your_pinecone_index
   # Add other environment variables as needed
   ```
8. Deploy to Heroku:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku master
   ```
9. Run database migrations:
   ```
   heroku run npm run migrate
   ```

### Option 2: AWS Deployment

#### Frontend Deployment (AWS Amplify)

1. Create an AWS account if you don't have one
2. Install the AWS Amplify CLI:
   ```
   npm install -g @aws-amplify/cli
   ```
3. Configure Amplify:
   ```
   amplify configure
   ```
4. Navigate to the client directory:
   ```
   cd client
   ```
5. Initialize Amplify:
   ```
   amplify init
   ```
6. Add hosting:
   ```
   amplify add hosting
   ```
7. Deploy:
   ```
   amplify publish
   ```

#### Backend Deployment (AWS Elastic Beanstalk)

1. Install the AWS CLI and EB CLI:
   ```
   pip install awscli
   pip install awsebcli
   ```
2. Configure AWS CLI:
   ```
   aws configure
   ```
3. Navigate to the server directory:
   ```
   cd server
   ```
4. Initialize EB application:
   ```
   eb init
   ```
5. Create an environment:
   ```
   eb create pharaohs-compass-api-env
   ```
6. Set environment variables:
   ```
   eb setenv NODE_ENV=production JWT_SECRET=your_jwt_secret ...
   ```
7. Deploy:
   ```
   eb deploy
   ```

### Option 3: Docker Deployment

#### Prerequisites

1. Docker and Docker Compose installed

#### Steps

1. Create a `docker-compose.yml` file in the root directory:
   ```yaml
   version: '3'
   
   services:
     client:
       build: ./client
       ports:
         - "3000:3000"
       environment:
         - REACT_APP_API_URL=http://server:5000/api
       depends_on:
         - server
   
     server:
       build: ./server
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - DB_HOST=postgres
         - DB_USERNAME=postgres
         - DB_PASSWORD=postgres
         - DB_NAME=pharaohs_compass
         # Add other environment variables
       depends_on:
         - postgres
   
     postgres:
       image: postgres:14
       ports:
         - "5432:5432"
       environment:
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_DB=pharaohs_compass
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

2. Create a `Dockerfile` in the client directory:
   ```dockerfile
   FROM node:16-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   
   RUN npm install
   
   COPY . .
   
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "run", "preview"]
   ```

3. Create a `Dockerfile` in the server directory:
   ```dockerfile
   FROM node:16-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   
   RUN npm install
   
   COPY . .
   
   EXPOSE 5000
   
   CMD ["npm", "start"]
   ```

4. Build and run the containers:
   ```
   docker-compose up -d
   ```

## Pinecone Vector Database Setup

1. Create a Pinecone account at [pinecone.io](https://www.pinecone.io/)
2. Create a new index with the following settings:
   - Dimensions: 768 (or the dimension of your embeddings)
   - Metric: Cosine
   - Pod Type: p1.x1 (or choose based on your needs)
3. Get your API key and environment from the Pinecone dashboard
4. Set the environment variables in your deployment environment

## Gemini API Setup

1. Create a Google Cloud account if you don't have one
2. Enable the Gemini API in your Google Cloud project
3. Create an API key
4. Set the `GEMINI_API_KEY` environment variable in your deployment environment

## Database Migrations

After deploying the backend, run the database migrations:

```
npm run migrate
```

## Seeding the Database

To populate the database with initial data:

```
npm run seed
```

## Monitoring and Logging

For production deployments, consider setting up:

1. Application monitoring with New Relic or Datadog
2. Log management with Loggly or Papertrail
3. Error tracking with Sentry

## SSL Configuration

Ensure your production deployment uses HTTPS:

1. For Vercel and Heroku, SSL is configured automatically
2. For AWS, you can use AWS Certificate Manager
3. For custom deployments, consider using Let's Encrypt

## Scaling Considerations

As your application grows:

1. Consider using a CDN like Cloudflare for static assets
2. Implement caching strategies with Redis
3. Set up auto-scaling for your backend services
4. Optimize database queries and consider read replicas

## Backup Strategy

Implement regular backups for your database:

1. For PostgreSQL, use pg_dump for regular backups
2. Store backups in a secure location (e.g., AWS S3)
3. Test restoration procedures periodically
