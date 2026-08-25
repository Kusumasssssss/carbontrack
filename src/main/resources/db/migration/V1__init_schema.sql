-- Create organisations table first
CREATE TABLE organisations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    admin_user_id BIGINT
);

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'ORG_ADMIN') DEFAULT 'USER',
    org_id BIGINT,
    CONSTRAINT fk_user_org FOREIGN KEY (org_id) REFERENCES organisations(id) ON DELETE SET NULL
);

-- Add foreign key from organisations to users for admin_user_id
ALTER TABLE organisations
ADD CONSTRAINT fk_org_admin FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create activity_logs table
CREATE TABLE activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    co2e_kg DECIMAL(10,4) NOT NULL,
    log_date DATE NOT NULL,
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create emission_factors table
CREATE TABLE emission_factors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_type VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    kg_co2e_per_unit DECIMAL(10,4) NOT NULL,
    source VARCHAR(255),
    effective_date DATE NOT NULL
);

-- Create goals table
CREATE TABLE goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_reduction_pct DECIMAL(5,2) NOT NULL,
    period_days INT NOT NULL,
    start_date DATE NOT NULL,
    status ENUM('ACTIVE', 'ACHIEVED', 'MISSED') DEFAULT 'ACTIVE',
    CONSTRAINT fk_goal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create badges table
CREATE TABLE badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    trigger_type ENUM('STREAK', 'GOAL', 'REDUCTION') NOT NULL,
    threshold INT NOT NULL
);

-- Create user_badges table
CREATE TABLE user_badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    badge_id BIGINT NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);
