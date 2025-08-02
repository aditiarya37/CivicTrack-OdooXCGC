const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173', // Vite default port
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any undefined values

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-File-Name'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Security middleware with adjusted settings for CORS
app.use(helmet({
  crossOriginResourcePolicy: { 
    policy: "cross-origin" 
  },
  crossOriginEmbedderPolicy: false, // Disable if causing issues with file uploads
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://nominatim.openstreetmap.org"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for preflight requests
    return req.method === 'OPTIONS';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Static files for uploads with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    // Set proper CORS headers for static files
    res.set({
      'Access-Control-Allow-Origin': '*', // Allow all origins for static files
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });
  }
}));

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads', { recursive: true });
}

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('Origin') || 'No Origin'}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CivicTrack API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// CORS error handling
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      origin: req.get('Origin')
    });
  }
  next(err);
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    origin: req.get('Origin'),
    userAgent: req.get('User-Agent')
  });
  
  res.status(err.status || 500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔒 CORS enabled for development origins`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});