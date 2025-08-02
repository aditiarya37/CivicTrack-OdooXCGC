const db = require('../config/database');

class Issue {
  static async create(issueData) {
    const { 
      title, description, category, latitude, longitude, 
      address, userId, photos, isAnonymous = false 
    } = issueData;
    
    const [result] = await db.execute(
      `INSERT INTO issues (title, description, category, latitude, longitude, address, 
       user_id, photos, is_anonymous, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'reported', NOW())`,
      [title, description, category, latitude, longitude, address, userId, JSON.stringify(photos || []), isAnonymous]
    );
    
    // Create initial status log
    await db.execute(
      'INSERT INTO status_logs (issue_id, status, changed_at) VALUES (?, ?, NOW())',
      [result.insertId, 'reported']
    );
    
    return result.insertId;
  }

  static async findNearby(latitude, longitude, radius = 5) {
    const [rows] = await db.execute(`
      SELECT i.*, u.first_name, u.last_name,
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
         cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
         sin(radians(latitude)))) AS distance
      FROM issues i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.is_hidden = false
      HAVING distance < ?
      ORDER BY i.created_at DESC
    `, [latitude, longitude, latitude, radius]);
    
    return rows.map(row => ({
      ...row,
      photos: row.photos ? JSON.parse(row.photos) : []
    }));
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT i.*, u.first_name, u.last_name
      FROM issues i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE i.id = ?
    `, [id]);
    
    if (rows[0]) {
      rows[0].photos = rows[0].photos ? JSON.parse(rows[0].photos) : [];
    }
    
    return rows[0];
  }

  static async updateStatus(id, status, adminId = null) {
    await db.execute('UPDATE issues SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    await db.execute(
      'INSERT INTO status_logs (issue_id, status, changed_by, changed_at) VALUES (?, ?, ?, NOW())',
      [id, status, adminId]
    );
  }

  static async flag(id, userId) {
    await db.execute(
      `INSERT INTO issue_flags (issue_id, user_id, created_at) 
       VALUES (?, ?, NOW()) 
       ON DUPLICATE KEY UPDATE created_at = NOW()`,
      [id, userId]
    );
    
    // Check if issue should be auto-hidden (3+ flags)
    const [flagCount] = await db.execute(
      'SELECT COUNT(*) as count FROM issue_flags WHERE issue_id = ?',
      [id]
    );
    
    if (flagCount[0].count >= 3) {
      await db.execute('UPDATE issues SET is_hidden = true WHERE id = ?', [id]);
    }
  }

  static async getStatusHistory(id) {
    const [rows] = await db.execute(`
      SELECT sl.*, u.first_name, u.last_name
      FROM status_logs sl
      LEFT JOIN users u ON sl.changed_by = u.id
      WHERE sl.issue_id = ?
      ORDER BY sl.changed_at DESC
    `, [id]);
    
    return rows;
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT i.*, u.first_name, u.last_name, 
             (SELECT COUNT(*) FROM issue_flags WHERE issue_id = i.id) as flag_count
      FROM issues i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND i.status = ?';
      params.push(filters.status);
    }

    if (filters.category) {
      query += ' AND i.category = ?';
      params.push(filters.category);
    }

    if (filters.flagged) {
      query += ' AND i.is_hidden = true';
    }

    query += ' ORDER BY i.created_at DESC';

    const [rows] = await db.execute(query, params);
    return rows.map(row => ({
      ...row,
      photos: row.photos ? JSON.parse(row.photos) : []
    }));
  }

  static async getAnalytics() {
    const [totalIssues] = await db.execute('SELECT COUNT(*) as count FROM issues');
    const [categoryStats] = await db.execute(`
      SELECT category, COUNT(*) as count 
      FROM issues 
      GROUP BY category 
      ORDER BY count DESC
    `);
    const [statusStats] = await db.execute(`
      SELECT status, COUNT(*) as count 
      FROM issues 
      GROUP BY status
    `);
    const [recentIssues] = await db.execute(`
      SELECT COUNT(*) as count 
      FROM issues 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    
    return {
      totalIssues: totalIssues[0].count,
      recentIssues: recentIssues[0].count,
      categoryStats,
      statusStats
    };
  }

  static async hideIssue(id) {
    await db.execute('UPDATE issues SET is_hidden = true WHERE id = ?', [id]);
  }

  static async unhideIssue(id) {
    await db.execute('UPDATE issues SET is_hidden = false WHERE id = ?', [id]);
  }
}

module.exports = Issue;