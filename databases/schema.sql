-- ===================================================
-- Database Schema for User, Roles, User_Roles (RBAC), OTPs,
-- Donors, Receivers, Food Items, Money Donations, and Donation Requests
-- ===================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `donation_requests`;
DROP TABLE IF EXISTS `money_donations`;
DROP TABLE IF EXISTS `food_items`;
DROP TABLE IF EXISTS `receivers`;
DROP TABLE IF EXISTS `donors`;
DROP TABLE IF EXISTS `otps`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel User Roles (Junction Table RBAC)
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel OTPs (One-Time Passwords)
CREATE TABLE IF NOT EXISTS `otps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL,
  `otp_code` VARCHAR(10) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_used` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_otp` (`user_id`, `otp_code`, `is_used`),
  CONSTRAINT `fk_otps_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Donors (Profil Donatur) - business_name bersifat opsional
CREATE TABLE IF NOT EXISTS `donors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL UNIQUE,
  `business_name` VARCHAR(150) DEFAULT NULL,
  `business_type` VARCHAR(100) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `operational_hours` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_donors_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Receivers (Profil Penerima Manfaat)
CREATE TABLE IF NOT EXISTS `receivers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT NOT NULL UNIQUE,
  `receiver_type` VARCHAR(100) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_receivers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Food Items (Donasi Makanan)
CREATE TABLE IF NOT EXISTS `food_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `donor_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `food_type` VARCHAR(100) DEFAULT NULL,
  `photo_url` VARCHAR(255) DEFAULT NULL,
  `total_portions` INT NOT NULL DEFAULT 0,
  `available_portions` INT NOT NULL DEFAULT 0,
  `pickup_address` TEXT DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `pickup_start_at` DATETIME DEFAULT NULL,
  `pickup_end_at` DATETIME DEFAULT NULL,
  `status` ENUM('available', 'claimed', 'expired', 'cancelled') DEFAULT 'available',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_food_items_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tabel Money Donations (Donasi Uang)
CREATE TABLE IF NOT EXISTS `money_donations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `donor_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  `payment_method` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_money_donations_donor` FOREIGN KEY (`donor_id`) REFERENCES `donors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tabel Donation Requests (Pengajuan / Permintaan Donasi Makanan oleh Receiver)
CREATE TABLE IF NOT EXISTS `donation_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `public_id` VARCHAR(50) NOT NULL UNIQUE,
  `food_item_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `requested_portions` INT NOT NULL DEFAULT 1,
  `status` ENUM('pending', 'confirmed', 'picked_up', 'cancelled', 'expired', 'rejected') DEFAULT 'pending',
  `requested_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` DATETIME DEFAULT NULL,
  `picked_up_at` DATETIME DEFAULT NULL,
  `cancelled_at` DATETIME DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_donation_requests_food_item` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_donation_requests_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `receivers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- Seed Data Awal
-- ===================================================

-- 1. Seed Roles
INSERT INTO `roles` (`id`, `public_id`, `name`, `description`) 
VALUES 
  (1, 'role_admin_001', 'admin', 'Administrator dengan akses penuh ke seluruh sistem'),
  (2, 'role_user_002', 'user', 'Pengguna standar sistem'),
  (3, 'role_donor_003', 'donor', 'Pengguna bertindak sebagai donatur makanan/barang'),
  (4, 'role_receiver_004', 'receiver', 'Pengguna bertindak sebagai penerima manfaat')
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `description` = VALUES(`description`), 
  `public_id` = VALUES(`public_id`);

-- 2. Seed Users
-- Password 'admin123'  -> $2b$10$7Q4Me9.L/LJBnWu3VH4iV./oOqmWk8NYV5iyxrrbHxwAPfsK2D4mG
-- Password 'password123' -> $2b$10$aE6xU7Y3Gf0p2vS0L4nFuu7kC9o1H3Jk2lM4n5O6P7q8R9s0T1u2V
INSERT INTO `users` (`id`, `public_id`, `name`, `email`, `password`, `phone`, `is_verified`) 
VALUES 
  (1, 'usr_admin_001', 'Administrator Sistem', 'admin@gmail.com', '$2b$10$7Q4Me9.L/LJBnWu3VH4iV./oOqmWk8NYV5iyxrrbHxwAPfsK2D4mG', '081234567890', 1),
  (2, 'usr_donor_002', 'Warung Berkah Nusantara', 'donatur@foodbridge.test', '$2b$10$7Q4Me9.L/LJBnWu3VH4iV./oOqmWk8NYV5iyxrrbHxwAPfsK2D4mG', '081298765432', 1),
  (3, 'usr_receiver_003', 'Panti Asuhan Kasih Mandiri', 'penerima@foodbridge.test', '$2b$10$7Q4Me9.L/LJBnWu3VH4iV./oOqmWk8NYV5iyxrrbHxwAPfsK2D4mG', '085711223344', 1)
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `password` = VALUES(`password`),
  `phone` = VALUES(`phone`),
  `is_verified` = VALUES(`is_verified`);

-- 3. Seed User Roles (RBAC Mapping)
INSERT INTO `user_roles` (`user_id`, `role_id`) 
VALUES 
  (1, 1), -- Admin -> admin role
  (1, 3), -- Admin -> donor role access
  (2, 3), -- Donatur -> donor role
  (3, 4)  -- Penerima -> receiver role
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

-- 4. Seed Donors Profile
INSERT INTO `donors` (`id`, `public_id`, `user_id`, `business_name`, `business_type`, `address`, `latitude`, `longitude`, `operational_hours`, `description`, `is_verified`)
VALUES 
  (1, 'dnr_admin_001', 1, 'Pusat Distribusi FoodBridge', 'Pusat Logistik Pangan', 'Jl. Merdeka No. 1, Jakarta Pusat', -6.175392, 106.827153, '08:00 - 20:00 WIB', 'Hub logistik resmi platform FoodBridge', 1),
  (2, 'dnr_donor_002', 2, 'Warung Berkah Nusantara', 'Restoran / Rumah Makan', 'Jl. Boulevard Raya Blok QJ No. 12, Kelapa Gading, Jakarta Utara', -6.155300, 106.904800, '09:00 - 21:00 WIB', 'Menyajikan kuliner khas nusantara dan aktif mendonasikan makanan berlebih', 1)
ON DUPLICATE KEY UPDATE 
  `business_name` = VALUES(`business_name`),
  `address` = VALUES(`address`),
  `is_verified` = VALUES(`is_verified`);

-- 5. Seed Receivers Profile
INSERT INTO `receivers` (`id`, `public_id`, `user_id`, `receiver_type`, `address`, `latitude`, `longitude`, `description`, `is_verified`)
VALUES 
  (1, 'rcv_admin_001', 1, 'Pengelola Manfaat', 'Jl. Merdeka No. 1, Jakarta Pusat', -6.175392, 106.827153, 'Akun receiver pengelola sistem', 1),
  (2, 'rcv_mandiri_002', 3, 'Panti Asuhan & Yayasan Sosial', 'Jl. Salemba Raya No. 45, Jakarta Pusat', -6.195500, 106.852000, 'Yayasan penampungan 45 anak asuh dan lansia', 1)
ON DUPLICATE KEY UPDATE 
  `receiver_type` = VALUES(`receiver_type`),
  `address` = VALUES(`address`),
  `is_verified` = VALUES(`is_verified`);

-- 6. Seed Sample Food Items
INSERT INTO `food_items` (`id`, `public_id`, `donor_id`, `title`, `description`, `food_type`, `photo_url`, `total_portions`, `available_portions`, `pickup_address`, `latitude`, `longitude`, `pickup_start_at`, `pickup_end_at`, `status`)
VALUES
  (1, 'food_001', 2, 'Nasi Box Ayam Bakar & Lalapan Komplit', 'Nasi box ayam bakar kecap, tahu, tempe, lalapan segar dan sambal bajak. Higienis dan siap santap.', 'makanan berat', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', 25, 18, 'Jl. Boulevard Raya Blok QJ No. 12, Kelapa Gading, Jakarta Utara', -6.155300, 106.904800, '2026-09-05 16:00:00', '2026-09-05 19:30:00', 'available'),
  (2, 'food_002', 2, 'Aneka Roti Manis & Butter Croissant', 'Roti bakery produksi harian: roti cokelat, keju, croissant mentega, dan abon gurih. Kondisi prima dan renyah.', 'ringan', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 30, 14, 'Jl. Danau Sunter Utara No. 8, Sunter Agung, Jakarta Utara', -6.138800, 106.864000, '2026-09-05 17:00:00', '2026-09-05 20:00:00', 'available')
ON DUPLICATE KEY UPDATE 
  `title` = VALUES(`title`),
  `available_portions` = VALUES(`available_portions`);

SET FOREIGN_KEY_CHECKS = 1;

