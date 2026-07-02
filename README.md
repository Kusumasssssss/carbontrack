# CarbonTrack

CarbonTrack is a full-stack Java carbon footprint tracking platform where users log daily activities across transport, electricity, food, and shopping categories to track their environmental impact.

## Tech Stack
- **Backend**: Spring Boot 3 (Java), Spring Data JPA, Spring Security (JWT)
- **Database**: MySQL + Flyway for schema migrations
- **Frontend**: React.js with Tailwind CSS v3.4.17

## Current Project State
- **Database Schema**: Designed and implemented the MySQL schema (Users, Activity Logs, Goals, Badges, etc.) using Flyway migrations.
- **Frontend Setup**: Scaffolded the React frontend (`/frontend`), set up routing with `react-router-dom`, integrated Tailwind CSS, and designed the `Login`, `Signup`, and `Dashboard` screens.
- **Authentication**: Fully implemented JWT token-based authentication. 
  - The Spring Boot backend exposes `/api/auth/login` and `/api/auth/signup` and secures all other endpoints.
  - The React frontend handles auth state via `localStorage`, intercepting requests to inject the token.

## Setup Guide for Teammates

Welcome to CarbonTrack! Follow these instructions to get your local environment running.

### Prerequisites
- **Java 17** installed
- **Node.js** (v18+) and **npm** installed
- **MySQL** installed and running on port `3306`

### 1. Database Setup
1. Open your MySQL client and create the database:
   ```sql
   CREATE DATABASE carbontrack;
   ```
2. Update the `application.properties` (or create it since it's `.gitignore`d) in `src/main/resources/`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/carbontrack?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### 2. Running the Backend (Spring Boot)
1. Open a terminal in the project root.
2. Run the application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Note: The Flyway migrations will automatically create all the necessary tables on startup!)*

### 3. Running the Frontend (React)
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
