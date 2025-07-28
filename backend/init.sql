-- Initialize database with test user
-- This script runs automatically when the MySQL container starts

USE watchlist;

-- Create test user with hashed password (password: "password123")
-- Using bcrypt hash with 12 rounds as configured in the app
INSERT IGNORE INTO users (id, name, email, password, created_at, updated_at) 
VALUES (
    1, 
    'Test User', 
    'hello@d7om.dev', 
    '$2b$12$LQv3c1yqBw2LeOI.UKc9nu.lUfJnnAEu0jXeJVFBm/klU.0C19wGi', -- password123
    NOW(), 
    NOW()
);

-- Reset auto increment to ensure next user gets ID 2
ALTER TABLE users AUTO_INCREMENT = 2;