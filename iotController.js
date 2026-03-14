// src/controllers/iotController.js
const pool = require('../config/db');

exports.getData = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM iot_sensors');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSensors = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM iot_sensors WHERE district = $1`,
      [req.user.district]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLatestAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (r.sensor_id)
         s.id, s.name, s.type, s.location, s.status,
         r.temperature, r.humidity, r.soil_moisture,
         r.rainfall, r.recorded_at
       FROM iot_readings r
       JOIN iot_sensors s ON s.id = r.sensor_id
       WHERE s.district = $1
       ORDER BY r.sensor_id, r.recorded_at DESC`,
      [req.user.district]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getSensorHistory = async (req, res) => {
  try {
    const hours = Math.min(parseInt(req.query.hours) || 24, 168);
    const { rows } = await pool.query(
      `SELECT temperature, humidity, soil_moisture, rainfall, recorded_at
       FROM iot_readings
       WHERE sensor_id = $1
         AND recorded_at >= NOW() - ($2 * INTERVAL '1 hour')
       ORDER BY recorded_at ASC`,
      [req.params.id, hours]
    );
    res.json({ success: true, data: rows, hours });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (r.sensor_id)
         s.name AS sensor_name, s.location,
         r.temperature, r.humidity, r.soil_moisture, r.rainfall,
         s.temp_max, s.temp_min, s.humidity_max, s.soil_moisture_min
       FROM iot_readings r
       JOIN iot_sensors s ON s.id = r.sensor_id
       WHERE s.district = $1
       ORDER BY r.sensor_id, r.recorded_at DESC`,
      [req.user.district]
    );
    const alerts = [];
    for (const s of rows) {
      if (s.temp_max && s.temperature > s.temp_max)
        alerts.push({ sensor: s.sensor_name, location: s.location, type: 'High Temperature',   severity: 'high',   value: `${s.temperature}°C`, threshold: `>${s.temp_max}°C`,        message: `Temperature ${s.temperature}°C exceeds limit.` });
      if (s.temp_min && s.temperature < s.temp_min)
        alerts.push({ sensor: s.sensor_name, location: s.location, type: 'Low Temperature',    severity: 'medium', value: `${s.temperature}°C`, threshold: `<${s.temp_min}°C`,        message: `Temperature ${s.temperature}°C below minimum.` });
      if (s.humidity_max && s.humidity > s.humidity_max)
        alerts.push({ sensor: s.sensor_name, location: s.location, type: 'High Humidity',      severity: 'medium', value: `${s.humidity}%`,     threshold: `>${s.humidity_max}%`,     message: `Humidity ${s.humidity}% — fungal risk.` });
      if (s.soil_moisture_min && s.soil_moisture < s.soil_moisture_min)
        alerts.push({ sensor: s.sensor_name, location: s.location, type: 'Low Soil Moisture',  severity: 'high',   value: `${s.soil_moisture}%`,threshold: `<${s.soil_moisture_min}%`,message: `Soil moisture critically low — irrigate immediately.` });
    }
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.postReading = async (req, res) => {
  try {
    const { sensor_id, device_key, temperature, humidity, soil_moisture, rainfall } = req.body;
    const sensor = await pool.query(
      `SELECT id FROM iot_sensors WHERE id=$1 AND device_key=$2 AND status='active'`,
      [sensor_id, device_key]
    );
    if (!sensor.rows.length)
      return res.status(403).json({ success: false, error: 'Invalid sensor ID or device key.' });
    const { rows } = await pool.query(
      `INSERT INTO iot_readings (sensor_id, temperature, humidity, soil_moisture, rainfall)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [sensor_id, temperature, humidity, soil_moisture, rainfall]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.setThresholds = async (req, res) => {
  try {
    const { temp_max, temp_min, humidity_max, soil_moisture_min } = req.body;
    const { rows } = await pool.query(
      `UPDATE iot_sensors
       SET temp_max=$1, temp_min=$2, humidity_max=$3, soil_moisture_min=$4
       WHERE id=$5 AND district=$6 RETURNING *`,
      [temp_max, temp_min, humidity_max, soil_moisture_min, req.params.id, req.user.district]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, error: 'Sensor not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};