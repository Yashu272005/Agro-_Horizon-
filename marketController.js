// ── Market Intelligence Controller ─────────────────────────
// All backend logic for MarketIntelligence.tsx
const axios     = require('axios');
const pool      = require('../config/db');
const Anthropic = require('@anthropic-ai/sdk');

const client        = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
const AGMARKNET_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// ── GET /api/market/prices?crop=Onion ─────────────────────
// Fetches live mandi prices from India's official Agmarknet API
// crop is optional — if not given, returns all commodities in district
exports.getLivePrices = async (req, res) => {
  try {
    const { crop } = req.query;

    const params = {
      'api-key':           process.env.DATA_GOV_KEY,
      format:              'json',
      limit:               50,
      'filters[state]':    'Maharashtra',
      'filters[district]': req.user.district
    };
    if (crop) params['filters[commodity]'] = crop;

    const { data } = await axios.get(AGMARKNET_URL, { params });

    // Clean and normalise the raw API response
    const prices = (data.records || []).map(r => ({
      market:      r.market,
      commodity:   r.commodity,
      variety:     r.variety,
      min_price:   parseFloat(r.min_price)   || 0,
      max_price:   parseFloat(r.max_price)   || 0,
      modal_price: parseFloat(r.modal_price) || 0,  // modal = most common traded price
      unit:        'Rs/Quintal',
      date:        r.arrival_date
    }));

    // Also save to our DB so we build up price history over time
    for (const p of prices) {
      await pool.query(
        `INSERT INTO market_prices (district, commodity, market, modal_price, min_price, max_price)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
        [req.user.district, p.commodity, p.market, p.modal_price, p.min_price, p.max_price]
      ).catch(() => {}); // silently skip DB errors — live data still returns
    }

    res.json({ success: true, count: prices.length, data: prices });
  } catch (err) {
    // If Agmarknet is down, fall back to our cached DB data
    try {
      const { rows } = await pool.query(
        `SELECT * FROM market_prices
         WHERE district=$1
           AND recorded_date = (SELECT MAX(recorded_date) FROM market_prices WHERE district=$1)
         ORDER BY commodity`,
        [req.user.district]
      );
      res.json({ success: true, count: rows.length, data: rows, source: 'cache' });
    } catch {
      res.status(500).json({ success: false, error: 'Market data unavailable. Try again later.' });
    }
  }
};

// ── GET /api/market/prices/history?crop=Soybean&days=30 ───
// Returns price trend for a specific crop — used for the line chart
exports.getPriceHistory = async (req, res) => {
  try {
    const { crop, days = 30 } = req.query;
    if (!crop) return res.status(400).json({ success: false, error: 'crop param required.' });

    const { rows } = await pool.query(
      `SELECT commodity, modal_price, min_price, max_price, recorded_date
       FROM market_prices
       WHERE district=$1
         AND commodity ILIKE $2
         AND recorded_date >= CURRENT_DATE - ($3 * INTERVAL '1 day')
       ORDER BY recorded_date ASC`,
      [req.user.district, `%${crop}%`, parseInt(days)]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/market/prices/compare?crops=Soybean,Cotton,Onion ──
// Compare current prices across multiple crops side by side
exports.comparecrops = async (req, res) => {
  try {
    const crops = (req.query.crops || '').split(',').map(c => c.trim()).filter(Boolean);
    if (!crops.length) return res.status(400).json({ success: false, error: 'crops param required.' });

    const results = {};
    for (const crop of crops) {
      const { rows } = await pool.query(
        `SELECT commodity, modal_price, min_price, max_price, recorded_date
         FROM market_prices
         WHERE district=$1 AND commodity ILIKE $2
         ORDER BY recorded_date DESC LIMIT 1`,
        [req.user.district, `%${crop}%`]
      );
      results[crop] = rows[0] || null;
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/market/mandis ────────────────────────────────
// List of nearby agricultural markets (mandis) in the district
exports.getMandis = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM mandis WHERE district=$1 ORDER BY name`,
      [req.user.district]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/market/insights ──────────────────────────────
// Uses Claude AI to generate market insights for the district
// e.g. "Onion prices are rising — good time to sell soybean"
exports.getInsights = async (req, res) => {
  try {
    // Fetch recent prices to give Claude context
    const { rows: prices } = await pool.query(
      `SELECT commodity, modal_price, recorded_date
       FROM market_prices
       WHERE district=$1
         AND recorded_date >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY commodity, recorded_date DESC`,
      [req.user.district]
    );

    if (!prices.length) {
      return res.json({ success: true, data: { insights: 'No recent price data available for analysis.' } });
    }

    // Format prices for Claude
    const priceText = prices
      .map(p => `${p.commodity}: ₹${p.modal_price}/quintal on ${p.recorded_date}`)
      .join('\n');

    const response = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{
        role:    'user',
        content: `You are a market analyst for ${req.user.district} district, Maharashtra.
Based on these recent mandi prices:
${priceText}

Give 3 short, practical insights for farmers:
1. Which crop has the best price right now and why they should sell
2. Any price trends they should watch
3. One actionable recommendation

Keep it under 150 words. Write in simple English.`
      }]
    });

    res.json({
      success: true,
      data: {
        insights:  response.content[0].text,
        based_on:  prices.length + ' price records',
        generated: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not generate insights.' });
  }
};
