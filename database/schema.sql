-- Job Portal Database Schema
-- PostgreSQL / MySQL compatible

CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Users Table (both Job Seekers and Employers)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('seeker', 'employer', 'admin') NOT NULL DEFAULT 'seeker',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_pic VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seeker Profiles
CREATE TABLE seeker_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    headline VARCHAR(255),
    bio TEXT,
    skills JSON,
    experience_years INT DEFAULT 0,
    education JSON,
    resume_url VARCHAR(500),
    location VARCHAR(255),
    expected_salary INT,
    availability ENUM('immediate', '15days', '1month', '2months') DEFAULT 'immediate',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Companies
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(500),
    website VARCHAR(500),
    industry VARCHAR(100),
    size ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
    description TEXT,
    location VARCHAR(255),
    founded_year INT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Jobs
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    job_type ENUM('full-time', 'part-time', 'contract', 'internship', 'remote') NOT NULL,
    location VARCHAR(255),
    salary_min INT,
    salary_max INT,
    skills_required JSON,
    experience_required INT DEFAULT 0,
    education_required VARCHAR(100),
    application_deadline DATE,
    status ENUM('active', 'paused', 'closed') DEFAULT 'active',
    views_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Applications
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    seeker_id INT NOT NULL,
    cover_letter TEXT,
    resume_url VARCHAR(500),
    status ENUM('applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected') DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (job_id, seeker_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Saved Jobs
CREATE TABLE saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_save (user_id, job_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('application', 'job', 'system') DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample Data
INSERT INTO users (email, password_hash, role, full_name, phone) VALUES
('admin@jobportal.com', '$2b$10$hashedpassword', 'admin', 'Admin User', '9999999999'),
('employer@techcorp.com', '$2b$10$hashedpassword', 'employer', 'Rahul Sharma', '9876543210'),
('john@seeker.com', '$2b$10$hashedpassword', 'seeker', 'John Doe', '9123456789');

INSERT INTO companies (employer_id, name, industry, size, location, description) VALUES
(2, 'TechCorp India', 'Technology', '201-500', 'Bangalore, Karnataka', 'Leading software company building innovative solutions.'),
(2, 'StartupHub', 'E-Commerce', '11-50', 'Mumbai, Maharashtra', 'Fast-growing e-commerce startup.');

INSERT INTO jobs (company_id, title, description, job_type, location, salary_min, salary_max, experience_required, skills_required) VALUES
(1, 'Senior React Developer', 'We are looking for an experienced React developer...', 'full-time', 'Bangalore', 1200000, 2000000, 3, '["React", "JavaScript", "Node.js", "MongoDB"]'),
(1, 'Python Backend Engineer', 'Join our backend team to build scalable APIs...', 'full-time', 'Remote', 1000000, 1800000, 2, '["Python", "FastAPI", "PostgreSQL", "Docker"]'),
(2, 'UI/UX Designer', 'Design beautiful user interfaces for our products...', 'full-time', 'Mumbai', 800000, 1400000, 2, '["Figma", "Adobe XD", "CSS", "Prototyping"]'),
(2, 'DevOps Engineer', 'Manage our cloud infrastructure and CI/CD pipelines...', 'contract', 'Remote', 1500000, 2500000, 4, '["AWS", "Docker", "Kubernetes", "Terraform"]');
