const db = require('../config/database');

class StatusLog {
  static async create(logData) {
    const { issueId, status, changedBy } = logData;
    
    const [result] = await db.execute(
      'INSERT INTO status_logs (issue_id, status, changed_by, changed_at) VALUES (?, ?, ?, NOW())',
      [issueId, status, changedBy]
    );
    
    return result.insertId;
  }

  static async findByIssueId(issueId) {
    const [rows] = await db.execute(`
      SELECT sl.*, u.first_name, u.last_name
      FROM status_logs sl
      LEFT JOIN users u ON sl.changed_by = u.id
      WHERE sl.issue_id = ?
      ORDER BY sl.changed_at DESC
    `, [issueId]);
    
    return rows;
  }
}

module.exports = StatusLog;
