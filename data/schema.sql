-- ==============================================================================
-- WAYECHO DATABASE SCHEMA (D-01)
-- Cơ sở dữ liệu quan hệ có chỉ mục không gian cho WayEcho Phố Cổ Hà Nội
-- Chuẩn hóa: Postgres (PostGIS) / MySQL 8.0+ tương thích
-- ==============================================================================

-- 1. Bảng Danh mục (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  label VARCHAR(128) NOT NULL,
  href VARCHAR(255) NOT NULL,
  icon VARCHAR(64) NOT NULL,
  sort_order INT DEFAULT 0
);

-- 2. Bảng Địa điểm & Dịch vụ (Destinations & Catalog Items)
-- Bắt buộc: is_old_quarter, image_alt_text NOT NULL, street_name, coordinates
CREATE TABLE IF NOT EXISTS destinations (
  id VARCHAR(128) PRIMARY KEY,
  category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name VARCHAR(255) NOT NULL,
  street_name VARCHAR(128) NOT NULL,
  address VARCHAR(255) NOT NULL,
  area VARCHAR(128) NOT NULL DEFAULT 'Phố Cổ, Hoàn Kiếm',
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  is_old_quarter BOOLEAN NOT NULL DEFAULT TRUE,
  image VARCHAR(512) NOT NULL,
  image_fallback VARCHAR(512) NOT NULL,
  image_alt_text TEXT NOT NULL,
  image_credit VARCHAR(255),
  image_source_url VARCHAR(512),
  audio_guide_url VARCHAR(512),
  audio_description TEXT,
  summary TEXT,
  opening_hours VARCHAR(255),
  price_info VARCHAR(255),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  verified_place BOOLEAN NOT NULL DEFAULT TRUE,
  checked_at DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ràng buộc Bounding Box Phố Cổ Hà Nội
  CONSTRAINT chk_old_quarter_lat CHECK (latitude >= 21.0250 AND latitude <= 21.0400),
  CONSTRAINT chk_old_quarter_lng CHECK (longitude >= 105.8450 AND longitude <= 105.8600)
);

-- Chỉ mục không gian và tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_dest_old_quarter ON destinations(is_old_quarter, latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_dest_street ON destinations(street_name);
CREATE INDEX IF NOT EXISTS idx_dest_category ON destinations(category_id);

-- 3. Bảng Hình ảnh Đa góc (Destination Images - A-09: Mỗi mục >= 3 ảnh)
CREATE TABLE IF NOT EXISTS destination_images (
  id VARCHAR(64) PRIMARY KEY,
  destination_id VARCHAR(128) NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  src VARCHAR(512) NOT NULL,
  alt_text TEXT NOT NULL,
  credit VARCHAR(255),
  license VARCHAR(128),
  source_url VARCHAR(512),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_images_destination ON destination_images(destination_id);

-- 4. Bảng Thuộc tính Trợ năng Chuẩn hóa (Accessibility Attributes)
-- group_type: mobility | service | environment
CREATE TABLE IF NOT EXISTS accessibility_attributes (
  code VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  group_type VARCHAR(32) NOT NULL CHECK (group_type IN ('mobility', 'service', 'environment')),
  description TEXT
);

-- 5. Bảng Liên kết Trợ năng Địa điểm (Destination Accessibility - Quan hệ Nhiều-Nhiều)
-- support_level: full | partial | none | unverified (Mặc định unverified theo nguyên tắc dữ liệu)
CREATE TABLE IF NOT EXISTS destination_accessibility (
  destination_id VARCHAR(128) NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  attribute_code VARCHAR(64) NOT NULL REFERENCES accessibility_attributes(code) ON DELETE RESTRICT,
  support_level VARCHAR(32) NOT NULL DEFAULT 'unverified' CHECK (support_level IN ('full', 'partial', 'none', 'unverified')),
  details_note TEXT,
  verified_by VARCHAR(128),
  verified_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (destination_id, attribute_code)
);

-- 6. Bảng Quản lý Phiên Người dùng (Sessions - I-01, I-04, I-07)
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(64) PRIMARY KEY,
  sid VARCHAR(64) UNIQUE NOT NULL,
  user_id VARCHAR(128) NOT NULL,
  role VARCHAR(32) NOT NULL,
  ip VARCHAR(64),
  user_agent VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_sid ON sessions(sid);
