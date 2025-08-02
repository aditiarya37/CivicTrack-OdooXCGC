// backend/config/config.js
module.exports = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'civictrack'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      expiresIn: '7d'
    },
    upload: {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    },
    email: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.FROM_EMAIL || 'noreply@civictrack.com'
    }
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d'
    },
    upload: {
      maxFileSize: 5 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    },
    email: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.FROM_EMAIL
    }
  }
};
