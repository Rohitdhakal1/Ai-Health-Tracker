# 🥗 AI HealthTracker (MERN Stack + TypeScript)

> **Live Demo:** [(https://ai-health-tracker-zg2o.vercel.app/)]  
> **Backend API:** [https://ai-health-tracker.onrender.com]

A full-stack health & fitness tracking application that uses **Generative AI (Google Gemini)** to simplify calorie logging. Users can log meals and workouts using natural language (e.g., *"I ate a burger and ran 5k"*), and the app automatically parses the nutritional data into structured JSON.


<img width="1920" height="868" alt="screencapture-ai-health-tracker-zg2o-vercel-app-dashboard-2025-11-24-16_07_20" src="https://github.com/user-attachments/assets/1856f353-f1aa-4e19-bdc5-4a04c02a00b5" />


## ✨ Key Features

* **🤖 AI-Powered Logging:** Integrated Google Gemini 2.0 Flash to parse unstructured text inputs into precise nutritional data (Calories, Macros) and exercise metrics.
* **🔥 Streak System:** Implemented a custom algorithm to track daily user engagement and login streaks, handling date logic across timezones.
* **🔐 Secure Authentication:** Built a robust auth system using JWT (JSON Web Tokens) with HttpOnly cookies and bcrypt password hashing.
* **📊 Real-Time Analytics:** Dynamic dashboard that aggregates daily caloric intake vs. BMR & exercise burn using MongoDB aggregations.
* **📱 Responsive UI:** Mobile-first design using React, Vite, and CSS-in-JS.

## 🛠️ Tech Stack

* **Frontend:** React.js, TypeScript, Vite, Context API, Axios (Interceptors).
* **Backend:** Node.js, Express.js, TypeScript.
* **Database:** MongoDB Atlas (Mongoose ODM).
* **AI:** Google Generative AI SDK (`@google/generative-ai`).
* **Deployment:** Vercel (Frontend), Render (Backend).

## 🚀 Architecture

1.  **Client:** React app sends natural language text to the backend.
2.  **Server:** Node.js acts as a secure proxy, injecting the system prompt and forwarding the request to Google Gemini.
3.  **AI Layer:** Gemini parses the text and returns a strict JSON array.
4.  **Data Layer:** MongoDB stores the relational data, linking `Food` and `Exercise` documents to the `User` ID.

## 🔧 Installation & Run Locally

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/yourusername/health-track-app.git](https://github.com/yourusername/health-track-app.git)
    ```

2.  **Install & Run Backend:**
    ```bash
    cd server
    npm install
    # Create a .env file with: MONGO_URI, JWT_SECRET, GEMINI_API_KEY
    npm run dev
    ```

3.  **Install & Run Frontend:**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## 🧠 Lessons Learned

* **Type Safety:** leveraging TypeScript interfaces (`IUser`, `IFood`) across the full stack prevented runtime errors and improved developer velocity.
* **AI Hallucination Control:** Implemented a "Human-in-the-loop" UI where users review AI suggestions before committing to the database.
* **Global State:** Used React Context to manage authentication state, preventing prop-drilling.

---

*Built by [Rohit dhakal]*
