-- database/migrations/004_create_issue_flags.sql
CREATE TABLE issue_flags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    issue_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_flag (issue_id, user_id),
    INDEX idx_issue_id (issue_id),
    INDEX idx_user_id (user_id)
);