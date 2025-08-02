# 🛰 CivicTrack - Civic Issue Reporting Platform

CivicTrack is a decentralized, hyper-local platform designed to *empower citizens* to report local civic issues (e.g., potholes, broken lights, garbage overflow), track their resolution, and contribute to cleaner and safer neighborhoods.

---

## 🚀 Problem Statement

Build a civic issue tracking system with the following goals:

- Allow users to report issues in their vicinity (within 3–5 km radius).
- Prevent access to reports outside user’s zone.
- Ensure spam prevention and moderation.
- Support status-based filtering, location-based pin view, and community safety features.

---

## 🧠 Core Features

### ✅ User Capabilities

- 📍 *GPS/Manual Location Selection*
- 📝 *Issue Reporting*
  - Title, Description
  - Up to 3–5 Photos
  - Category (Roads, Water, Cleanliness, Lighting, Safety, Obstructions)
  - Anonymous or Verified
- 📊 *View Nearby Issues* (within 3–5 km)
- 🗂 *Filter Issues By*
  - Status: Reported / In Progress / Resolved
  - Category
  - Distance: 1 km / 3 km / 5 km
- 🗺 *Map View* with pins
- 🔔 *Real-time Notifications* on status updates
- 🚩 *Spam Reporting* — auto-hide if flagged by multiple users

---

### 🛠 Admin Capabilities

- 🧾 View all reported issues
- 👮 Review flagged issues
- 🚫 Ban spammers
- 📈 Access analytics
  - Total reports
  - Most reported categories

---

## 🧱 Project Structure


civictrack/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── issues.js
│   │   └── users.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Issue.js
│   │   └── User.js
│   ├── uploads/             # For storing uploaded images
│   ├── app.js
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── App.jsx
    └── .env




---

## 🧪 Setup Instructions

### 1. Clone the Repository

bash
git clone https://github.com/your-org/civictrack.git
cd civictrack


### 2. Backend Setup

cd backend
npm install
cp .env.example .env  # Fill in values
node app.js


### 3. Frontend Setup

cd frontend
npm install
npm start


### 🛡 Tech Stack
- Frontend: React.js, Leaflet (Map), Axios

- Backend: Node.js, Express.js

- Database: MongoDB / PostgreSQL

- Storage: Local (for images) or S3 (optional)

- Authentication: JWT

- Security: Helmet, CORS, Rate Limiting

- Location: Browser GPS API, Leaflet Maps

### 🔐 Security Features
- Input validation + sanitation

- CORS configured per environment

- Passwords hashed (bcrypt)

- JWT-based session control

- Rate limiting to prevent abuse

-  Spam filtering with auto-moderation

### 🧰 Developer Notes
- Separate roles: user, admin

- Use .env to configure sensitive settings (DB URL, JWT secret, etc.)

- Use consistent file naming and modular code

- Error-handling middleware included

- Graceful shutdown logic

