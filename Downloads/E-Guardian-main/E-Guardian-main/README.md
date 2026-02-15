# E-Guardian: Smart Waste & Hazard Detection System

E-Guardian is a modern full-stack web application designed for identifying electronic waste hazards and provides recycling recommendations. Built for a final-year capstone project and resume portfolio.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Recharts, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt
- **Aesthetics**: Modern, responsive UI with glassmorphism and smooth animations.

## Project Structure
```
E-Guardian/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # App Router Pages
│   │   ├── components/    # UI Components
│   │   └── lib/           # Utilities & API client
│   └── package.json
├── server/                 # Express Backend
│   ├── controllers/       # Route Logic
│   ├── models/            # Mongoose Schemas
│   ├── routes/            # API Endpoints
│   ├── middleware/        # Auth Logic
│   └── server.js          # Entry point
└── README.md
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/e-guardian
JWT_SECRET=your_super_secret_key
```
Seed initial data (optional but recommended):
```bash
node data/seed.js
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features
- **AI Scan Simulation**: "Identify" devices and get hazard levels.
- **Environmental Dashboard**: Track CO2 saved and total scans via Recharts.
- **Recycling Centers**: Find nearby verified facilities (Mock Map integration ready for API).
- **Admin Dashboard**: View all hazard classifications in the database.
- **Secure Auth**: JWT-based login and signup flow.

## Deployment Guide
- **Frontend**: Deploy to [Vercel](https://vercel.com) (automagically detects Next.js).
- **Backend**: Deploy to [Render](https://render.com) or [Railway].
- **Database**: Use [MongoDB Atlas] (Free tier).

---
Built with ❤️ by Senior Full-Stack Developer AI.
