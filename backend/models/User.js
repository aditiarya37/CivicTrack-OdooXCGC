const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, firstName, lastName, phone, isAnonymous = false } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const [result] = await db.execute(
      `INSERT INTO users (email, password, first_name, last_name, phone, is_anonymous, role, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, 'user', NOW())`,
      [email, hashedPassword, firstName, lastName, phone, isAnonymous]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, email, first_name, last_name, phone, role, is_anonymous, is_banned, created_at 
       FROM users WHERE id = ?`, 
      [id]
    );
    return rows[0];
  }

  static async update(id, userData) {
    const { firstName, lastName, phone } = userData;
    await db.execute(
      'UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = NOW() WHERE id = ?',
      [firstName, lastName, phone, id]
    );
  }

  static async ban(id) {
    await db.execute('UPDATE users SET is_banned = true, updated_at = NOW() WHERE id = ?', [id]);
  }

  static async getAllUsers() {
    const [rows] = await db.execute(
      `SELECT id, email, first_name, last_name, role, is_banned, created_at 
       FROM users ORDER BY created_at DESC`
    );
    return rows;
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;