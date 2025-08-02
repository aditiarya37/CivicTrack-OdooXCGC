-- database/migrations/002_create_issues.sql
CREATE TABLE issues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('roads', 'lighting', 'water', 'cleanliness', 'safety', 'obstructions') NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    address TEXT,
    user_id INT NOT NULL,
    photos JSON,
    status ENUM('reported', 'in_progress', 'resolved') DEFAULT 'reported',
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_location (latitude, longitude),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_user_id (user_id)
);
