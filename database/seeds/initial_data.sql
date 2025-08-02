-- database/seeds/initial_data.sql
-- Insert admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, phone, role, created_at) VALUES 
('admin@civictrack.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYBtHm3HDO0u5.q', 'Admin', 'User', '+1234567890', 'admin', NOW());

-- Insert sample users (password: password123)
INSERT INTO users (email, password, first_name, last_name, phone, created_at) VALUES 
('john.doe@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '+1234567891', NOW()),
('jane.smith@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane', 'Smith', '+1234567892', NOW()),
('bob.wilson@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob', 'Wilson', '+1234567893', NOW());

-- Insert sample issues
INSERT INTO issues (title, description, category, latitude, longitude, address, user_id, status, created_at) VALUES 
('Large pothole on Main Street', 'There is a significant pothole near the intersection of Main Street and First Avenue that poses a hazard to vehicles. It has been growing larger over the past few weeks.', 'roads', 40.7128, -74.0060, '123 Main Street, New York, NY', 2, 'reported', NOW() - INTERVAL 2 DAY),
('Streetlight not working', 'The streetlight at the corner of Oak Street and Second Avenue has been out for over a week, making the area unsafe for pedestrians at night.', 'lighting', 40.7130, -74.0058, 'Oak Street & Second Avenue, New York, NY', 3, 'in_progress', NOW() - INTERVAL 1 DAY),
('Water leak in park', 'There appears to be a water leak near the playground in Central Park. Water is continuously flowing and creating a muddy area.', 'water', 40.7131, -74.0055, 'Central Park Playground Area, New York, NY', 4, 'reported', NOW() - INTERVAL 3 HOUR),
('Overflowing trash bin', 'The trash bin near the bus stop on Third Street is completely full and overflowing, attracting pests and creating an unsanitary condition.', 'cleanliness', 40.7125, -74.0062, 'Third Street Bus Stop, New York, NY', 2, 'resolved', NOW() - INTERVAL 5 DAY),
('Exposed electrical wire', 'There is an exposed electrical wire hanging from a utility pole on Fourth Avenue. This is a serious safety hazard that needs immediate attention.', 'safety', 40.7133, -74.0052, '456 Fourth Avenue, New York, NY', 3, 'reported', NOW() - INTERVAL 1 HOUR);

-- Insert status logs for the sample issues
INSERT INTO status_logs (issue_id, status, changed_by, changed_at) VALUES 
(1, 'reported', NULL, NOW() - INTERVAL 2 DAY),
(2, 'reported', NULL, NOW() - INTERVAL 1 DAY),
(2, 'in_progress', 1, NOW() - INTERVAL 12 HOUR),
(3, 'reported', NULL, NOW() - INTERVAL 3 HOUR),
(4, 'reported', NULL, NOW() - INTERVAL 5 DAY),
(4, 'in_progress', 1, NOW() - INTERVAL 4 DAY),
(4, 'resolved', 1, NOW() - INTERVAL 3 DAY),
(5, 'reported', NULL, NOW() - INTERVAL 1 HOUR);

-- Views for analytics
CREATE VIEW issue_analytics AS
SELECT 
    COUNT(*) as total_issues,
    COUNT(CASE WHEN status = 'reported' THEN 1 END) as reported_count,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
    COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as recent_issues
FROM issues 
WHERE is_hidden = FALSE;

CREATE VIEW category_analytics AS
SELECT 
    category,
    COUNT(*) as count,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count,
    ROUND(COUNT(CASE WHEN status = 'resolved' THEN 1 END) * 100.0 / COUNT(*), 2) as resolution_rate
FROM issues 
WHERE is_hidden = FALSE
GROUP BY category
ORDER BY count DESC;