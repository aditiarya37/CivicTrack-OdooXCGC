# CivicTrack 🛰️

A decentralized, hyper-local platform that allows citizens to report civic issues, track their resolution, and contribute to cleaner and safer neighborhoods.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Security](#security)

## 🌟 Overview

CivicTrack is a comprehensive civic issue reporting platform designed to bridge the gap between citizens and local authorities. The platform enables users to report local issues such as potholes, broken streetlights, garbage overflow, and other civic concerns within a 3-5 km radius of their location.

### Key Objectives

- **Hyper-local Focus**: Restrict issue visibility to user's immediate vicinity
- **Community Engagement**: Foster citizen participation in local governance
- **Transparency**: Track issue resolution progress in real-time
- **Spam Prevention**: Robust moderation and community-driven spam detection

## ✨ Features

### 👥 User Features

- **📍 Location Services**
  - GPS-based automatic location detection
  - Manual location selection with map interface
  - 3-5 km proximity-based issue filtering

- **📝 Issue Reporting**
  - Comprehensive issue submission with title and description
  - Multi-image upload (up to 5 photos per report)
  - Categorized reporting (Roads, Water, Cleanliness, Lighting, Safety, Obstructions)
  - Anonymous and verified reporting options

- **🔍 Issue Discovery**
  - Real-time nearby issues within customizable radius (1km, 3km, 5km)
  - Advanced filtering by status and category
  - Interactive map view with location pins
  - Status tracking (Reported → In Progress → Resolved)

- **🔔 Engagement**
  - Real-time push notifications for status updates
  - Community-driven spam reporting
  - Issue upvoting and commenting

### 🛠️ Admin Features

- **📊 Dashboard**
  - Comprehensive analytics and reporting
  - Issue resolution metrics
  - Category-wise trend analysis

- **👮 Moderation**
  - Flagged content review system
  - User management and spam prevention
  - Bulk issue status updates

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18+
- **State Management**: Context API / Redux Toolkit
- **Mapping**: Leaflet.js with OpenStreetMap
- **HTTP Client**: Axios
- **UI Components**: Material-UI / Tailwind CSS
- **Build Tool**: Vite / Create React App

### Backend
- **Runtime**: Node.js 14+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Joi / Express Validator

### Infrastructure & DevOps
- **Containerization**: Docker
- **Process Management**: PM2
- **Reverse Proxy**: Nginx
- **Cloud Storage**: AWS S3 (optional)
- **Monitoring**: Morgan (logging)

## 📁 Project Structure

```
civictrack/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   ├── 📁 middleware/
│   │   ├── 📁 models/
│   │   ├── 📁 routes/
│   │   ├── 📁 services/
│   │   ├── 📁 utils/
│   │   ├── 📁 config/
│   │   └── app.js
│   ├── 📁 uploads/
│   ├── 📁 tests/
│   │   ├── 📁 unit/
│   │   ├── 📁 integration/
│   │   └── 📁 fixtures/
│   ├── 📄 package.json
├── 📁 frontend/
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   ├── 📁 forms/
│   │   │   ├── 📁 map/
│   │   │   └── 📁 dashboard/
│   │   ├── 📁 pages/
│   │   ├── 📁 context/
│   │   ├── 📁 hooks/
│   │   ├── 📁 services/
│   │   ├── 📁 utils/
│   │   ├── 📁 styles/
│   ├── 📄 package.json
│   └── 📄 vite.config.js
```

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/civictrack.git
   cd civictrack
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm start
   ```

4. **Docker Setup (Alternative)**
   ```bash
   docker-compose up -d
   ```

## ⚙️ Configuration

### Backend Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/civictrack
DB_NAME=civictrack

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# External Services
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

### Frontend Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000

# Map Configuration
REACT_APP_MAP_API_KEY=your-mapbox-token
REACT_APP_DEFAULT_LAT=28.6139
REACT_APP_DEFAULT_LNG=77.2090

# App Configuration
REACT_APP_MAX_UPLOAD_SIZE=5242880
REACT_APP_SUPPORTED_FORMATS=jpeg,jpg,png,webp
REACT_APP_MAX_PROXIMITY_KM=5
```

## 📖 Usage

### For Citizens

1. **Register/Login** to create an account
2. **Enable Location Services** for proximity-based features
3. **Report Issues** by clicking "Report Issue" and filling out the form
4. **Track Progress** through real-time status updates
5. **Discover Nearby Issues** using the map view and filters

### For Administrators

1. **Access Admin Panel** with administrative credentials
2. **Review Reported Issues** and update their status
3. **Moderate Content** by reviewing flagged issues
4. **Analyze Trends** using the built-in analytics dashboard

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
POST /api/v1/auth/logout      # User logout
GET  /api/v1/auth/profile     # Get user profile
```

### Issue Management Endpoints

```
GET    /api/v1/issues         # Get nearby issues
POST   /api/v1/issues         # Create new issue
GET    /api/v1/issues/:id     # Get issue details
PUT    /api/v1/issues/:id     # Update issue status
DELETE /api/v1/issues/:id     # Delete issue (admin only)
POST   /api/v1/issues/:id/flag # Flag issue as spam
```

For detailed API documentation, see [API.md](docs/API.md).

## 🔐 Security

### Security Features

- **Authentication**: JWT-based secure authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Prevents API abuse and DDoS attacks
- **CORS Protection**: Configured for specific origins
- **File Upload Security**: File type and size validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization and CSP headers

### Best Practices

- Regular security audits using `npm audit`
- Environment-specific CORS configuration
- Secure HTTP headers with Helmet.js
- Request size limiting
- Automated spam detection and moderation

## 🧪 Testing

```bash
# Backend Tests
cd backend
npm test
npm run test:coverage

# Frontend Tests
cd frontend
npm test
npm run test:coverage

# Integration Tests
npm run test:integration
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   # Configure production environment variables
   ```

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

*Thankyou*


