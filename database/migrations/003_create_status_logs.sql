-- database/migrations/003_create_status_logs.sql
CREATE TABLE status_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    issue_id INT NOT NULL,
    status ENUM('reported', 'in_progress', 'resolved') NOT NULL,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_issue_id (issue_id),
    INDEX idx_changed_at (changed_at)
);
