// backend/scripts/seed.js - Create this file
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'civictrack'
  });

  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await connection.execute('DELETE FROM status_logs');
    await connection.execute('DELETE FROM issue_flags');
    await connection.execute('DELETE FROM issues');
    await connection.execute('DELETE FROM users');

    // Reset auto increment
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE issues AUTO_INCREMENT = 1');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await connection.execute(
      `INSERT INTO users (email, password, first_name, last_name, phone, role) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['admin@civictrack.com', adminPassword, 'Admin', 'User', '+1234567890', 'admin']
    );

    // Create sample users
    const userPassword = await bcrypt.hash('password123', 12);
    const users = [
      ['john.doe@example.com', userPassword, 'John', 'Doe', '+1234567891'],
      ['jane.smith@example.com', userPassword, 'Jane', 'Smith', '+1234567892'],
      ['bob.wilson@example.com', userPassword, 'Bob', 'Wilson', '+1234567893'],
      ['alice.brown@example.com', userPassword, 'Alice', 'Brown', '+1234567894']
    ];

    for (const user of users) {
      await connection.execute(
        `INSERT INTO users (email, password, first_name, last_name, phone, role) 
         VALUES (?, ?, ?, ?, ?, 'user')`,
        user
      );
    }

    // Create sample issues
    const issues = [
      {
        title: 'Large pothole on Main Street',
        description: 'There is a significant pothole near the intersection of Main Street and First Avenue that poses a hazard to vehicles.',
        category: 'roads',
        latitude: 30.7536,
        longitude: 76.7758,
        address: '123 Main Street, Ludhiana, Punjab',
        user_id: 2,
        status: 'reported'
      },
      {
        title: 'Streetlight not working',
        description: 'The streetlight at the corner of Civil Lines has been out for over a week.',
        category: 'lighting',
        latitude: 30.7543,
        longitude: 76.7749,
        address: 'Civil Lines, Ludhiana, Punjab',
        user_id: 3,
        status: 'in_progress'
      },
      {
        title: 'Water leak in park',
        description: 'There appears to be a water leak near the playground in Rose Garden.',
        category: 'water',
        latitude: 30.7520,
        longitude: 76.7755,
        address: 'Rose Garden, Ludhiana, Punjab',
        user_id: 4,
        status: 'reported'
      }
    ];

    for (const issue of issues) {
      const [result] = await connection.execute(
        `INSERT INTO issues (title, description, category, latitude, longitude, address, user_id, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW() - INTERVAL FLOOR(RAND() * 7) DAY)`,
        [issue.title, issue.description, issue.category, issue.latitude, issue.longitude, issue.address, issue.user_id, issue.status]
      );

      // Add status log
      await connection.execute(
        'INSERT INTO status_logs (issue_id, status, changed_at) VALUES (?, ?, NOW() - INTERVAL FLOOR(RAND() * 7) DAY)',
        [result.insertId, 'reported']
      );

      if (issue.status === 'in_progress') {
        await connection.execute(
          'INSERT INTO status_logs (issue_id, status, changed_by, changed_at) VALUES (?, ?, ?, NOW() - INTERVAL FLOOR(RAND() * 3) DAY)',
          [result.insertId, 'in_progress', 1]
        );
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin user: admin@civictrack.com / admin123');
    console.log('👥 Sample users: john.doe@example.com / password123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await connection.end();
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;