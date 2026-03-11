# AI Health Tracker

A comprehensive full-stack health and fitness tracking application that utilizes the Google Gemini AI model to facilitate seamless calorie and activity logging through natural language processing.

## Project Overview

The AI Health Tracker is designed to reduce the friction of manual data entry in fitness applications. By integrating large language models, the system can parse unstructured text inputs into structured nutritional and exercise data, providing users with an intuitive and efficient way to manage their health goals.

## Key Features

- **Natural Language Data Parsing**: Integration with Google Gemini Flash to extract calories, macros, and exercise duration from casual text descriptions.
- **Dynamic Goal Management**: Real-time calculation of calorie requirements based on user-specific physical metrics (BMR) and activity levels.
- **Engagement Tracking**: A robust streak system that monitors daily activity and login consistency.
- **Secure Authentication**: Implementation of JSON Web Tokens (JWT) for secure session management and data protection.
- **SaaS-Grade Dashboard**: A professional interface built with a constrained design system and custom typography (Bricolage Grotesque).

## Technology Stack

- **Frontend**: React.js, TypeScript, Vite, Context API, Axios.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: MongoDB with Mongoose ODM.
- **AI Engine**: Google Generative AI (Gemini Flash).
- **Styling**: Vanilla CSS with a global design system.

## Project Architecture

The application follows a standard MERN-type architecture with specialized AI middleware:

1. **Client Layer**: A React that captures user inputs and provides visual feedback through a custom dashboard.
2. **API Layer**: An Express server that handles authentication, data validation, and acts as a secure proxy for the Generative AI SDK.
3. **AI Integration**: A dedicated controller that prepares system prompts and parses AI responses into reliable JSON structures.
4. **Data Persistence**: MongoDB collections for Users, Food logs, and Exercise activities.

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google AI Studio API Key (Gemini)

### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Rohitdhakal1/Ai-Health-Tracker.git
   cd Ai-Health-Tracker
   ```

2. **Configure the Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

3. **Configure the Client**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend application:
   ```bash
   npm run dev
   ```

## Development and Deployment(some error occur its still due frontened not updated and backend error api limit )

The frontend is optimized for deployment on platforms like Vercel, while the backend is designed for environments like Render or Heroku. Ensure all environment variables are correctly configured in your production environment.

## License

This project is open-source and available under the MIT License.
