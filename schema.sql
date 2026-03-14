 schema.sql — Tables for IoT Monitor, Market Intel, Disease Detector
-- Run once: psql $DATABASE_URL -f schema.sql
-- ============================================================

-- ── IoT Sensors ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS iot_sensors (
  id                SERIAL PRIMARY KEY,
  district          VARCHAR(100) NOT NULL,
  name              VARCHAR(100) NOT NULL,       -- "Field A Sensor"
  type              VARCHAR(50),                 -- "soil", "weather", "rain_gauge"
  location          VARCHAR(200),                -- "North field, near borewell"
  device_key        VARCHAR(100) UNIQUE NOT NULL, -- secret key on physical device
  status            VARCHAR(20) DEFAULT 'active', -- "active" / "offline" / "maintenance"
  -- Alert thresholds (null = no alert for that metric)
  temp_max          NUMERIC(5,2),  -- alert if temperature exceeds this
  temp_min          NUMERIC(5,2),  -- alert if temperature drops below this
  humidity_max      NUMERIC(5,2),  -- alert if humidity exceeds this
  soil_moisture_min NUMERIC(5,2),  -- alert if soil moisture drops below this
  created_at        TIMESTAMP DEFAULT NOW()
);

-- ── IoT Readings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS iot_readings (
  id            SERIAL PRIMARY KEY,
  sensor_id     INTEGER REFERENCES iot_sensors(id) ON DELETE CASCADE,
  temperature   NUMERIC(5,2),    -- °C
  humidity      NUMERIC(5,2),    -- %
  soil_moisture NUMERIC(5,2),    -- % volumetric water content
  rainfall      NUMERIC(6,2),    -- mm
  recorded_at   TIMESTAMP DEFAULT NOW()
);
-- Fast lookup index for time-range queries and latest-per-sensor
CREATE INDEX IF NOT EXISTS idx_iot_time ON iot_readings(sensor_id, recorded_at DESC);

-- Sample sensor (replace device_key with your real key)
INSERT INTO iot_sensors (district, name, type, location, device_key, temp_max, humidity_max, soil_moisture_min)
VALUES ('Pune', 'Field A - Soil Sensor', 'soil', 'North field', 'DEV-KEY-001', 42, 88, 20)
ON CONFLICT DO NOTHING;

-- ── Market Prices ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS market_prices (
  id            SERIAL PRIMARY KEY,
  district      VARCHAR(100),
  commodity     VARCHAR(100),
  market        VARCHAR(100),
  modal_price   NUMERIC(10,2),   -- Rs/Quintal — most common traded price
  min_price     NUMERIC(10,2),
  max_price     NUMERIC(10,2),
  recorded_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(district, commodity, market, recorded_date)
);
CREATE INDEX IF NOT EXISTS idx_market_lookup ON market_prices(district, commodity, recorded_date DESC);

-- ── Mandis (markets) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS mandis (
  id        SERIAL PRIMARY KEY,
  district  VARCHAR(100),
  name      VARCHAR(200),
  address   TEXT,
  latitude  NUMERIC(9,6),
  longitude NUMERIC(9,6)
);
-- Sample mandis
INSERT INTO mandis (district, name, address) VALUES
  ('Pune',    'Pune APMC Market',   'Gultekdi, Pune'),
  ('Nashik',  'Nashik APMC Market', 'Nashik Road, Nashik'),
  ('Solapur', 'Solapur APMC',       'Market Yard, Solapur')
ON CONFLICT DO NOTHING;

-- ── Disease Detections ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS disease_detections (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER,                        -- references your users table
  district         VARCHAR(100),
  crop             VARCHAR(100),
  detection_method VARCHAR(20),                   -- "image" or "symptoms"
  disease_name     VARCHAR(200),
  confidence       VARCHAR(10),                   -- "high", "medium", "low"
  severity         VARCHAR(10),                   -- "mild", "moderate", "severe"
  treatment        JSONB,                         -- full treatment plan as JSON
  raw_response     JSONB,                         -- full Claude response
  created_at       TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_disease_user ON disease_detections(user_id, created_at DESC);

-- ── Users (minimal — add more fields as needed) ────────────
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100),
  phone      VARCHAR(15) UNIQUE,
  password   VARCHAR(255),
  district   VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);