-- ============================================
-- Dynamic Media Gallery
-- Full Stack Web Development - CLO 2
-- MySQL Database Schema
-- ============================================

-- Create the database if it does not already exist
CREATE DATABASE IF NOT EXISTS media_gallery
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE media_gallery;

-- ============================================
-- Media Table
-- Stores uploaded images and animated GIFs
-- directly in MySQL.
-- ============================================

CREATE TABLE IF NOT EXISTS media (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    file_name VARCHAR(255) NOT NULL,

    media_type ENUM('image', 'gif') NOT NULL,

    mime_type VARCHAR(100) NOT NULL,

    description TEXT NULL,

    file_size INT UNSIGNED NOT NULL,

    file_data LONGBLOB NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_media_type (media_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;