# CarbonTrack

CarbonTrack is a full-stack Java carbon footprint tracking platform where users log daily activities across transport, electricity, food, and shopping categories to track their environmental impact.

## Tech Stack

- **Backend**: Spring Boot 3 (Java), Spring Data JPA, Spring Security (JWT)
- **Database**: MySQL + Flyway for schema migrations
- **Frontend**: React.js with Tailwind CSS v3.4.17
- **AI Integration**: Groq API (Llama 3.3 70B) for personalized AI insights and chatbot

## Current Project State

- **Database Schema**: Designed and implemented the MySQL schema (Users, Activity Logs, Goals, Badges, etc.) using Flyway migrations.
- **Frontend Setup**: Scaffolded the React frontend (`/frontend`), set up routing with `react-router-dom`, integrated Tailwind CSS, and designed the `Login`, `Signup`, and `Dashboard` screens.
- **Authentication**: Fully implemented JWT token-based authentication.
  - The Spring Boot backend exposes `/api/auth/login` and `/api/auth/signup` and secures all other endpoints.
  - The React frontend handles auth state via `localStorage`, intercepting requests to inject the token.
- **OAuth2 Integration**: Google and GitHub OAuth2 login support configured.
- **AI Integration**: Integrated Groq API with Llama 3.3 70B model to provide personalized AI insights on the dashboard and built an interactive floating AI Sustainability Coach Chatbot.
- **Robust Carbon Calculation**: Implemented an intelligent emission calculation engine that maps generic user activities to emission factor categories (Electricity, Transport, Food, Waste) with reliable fallback multipliers.
- **Performance**: Integrated Redis caching for lightning-fast dashboard metric aggregation.
- **Frontend Configuration**: Created `frontend/src/config.js` to externalize API endpoints for different environments.

## Setup Guide for Teammates

Welcome to CarbonTrack! Follow these instructions to get your local environment running.

### Prerequisites

- **Java 17** installed
- **Node.js** (v18+) and **npm** installed
- **MySQL** installed and running on port `3306`
- **Redis** installed and running on port `6379` *(See [REDIS_SETUP.md](file:///c:/Users/Lenovo/Documents/Github/carbontrack/REDIS_SETUP.md) for a quick Docker setup guide!)*

### 1. Environment Setup
1. Create a `.env` file in the project root with the following variables (copy from `.env.example` if available):
   ```env
   # Groq API Integration
   GROQ_API_KEY=YOUR_GROQ_API_KEY
   
   # Database Configuration
   SPRING_DATASOURCE_PASSWORD=YOUR_MYSQL_PASSWORD
   
   # OAuth2 Configuration (optional - for Google/GitHub login)
   SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
   SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
   
   # JWT Configuration (optional - for custom JWT secret)
   JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY
   ```

2. Update `frontend/.env` (create if doesn't exist) for frontend environment variables:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/api
   REACT_APP_OAUTH2_GOOGLE_URL=http://localhost:8080/oauth2/authorization/google
   REACT_APP_OAUTH2_GITHUB_URL=http://localhost:8080/oauth2/authorization/github
   ```

### 2. Database Setup
1. Open your MySQL client and create the database:
   ```sql
   CREATE DATABASE carbontrack;
   ```
2. The database will be automatically populated with migrations on first startup via Flyway.

### 3. Running the Backend (Spring Boot)

1. Open a terminal in the project root.
2. Run the application using Maven:

   ```bash
   ./mvnw spring-boot:run
   ```

   *(Note: The Flyway migrations will automatically create all the necessary tables on startup!)*

### 4. Running the Frontend (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`. You should see the CarbonTrack Login page!
