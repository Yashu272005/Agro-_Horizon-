// ── Disease Detector Controller ─────────────────────────────
// Uses Claude's vision AI to diagnose crop diseases from images
// Also handles text-based symptom diagnosis
const Anthropic = require('@anthropic-ai/sdk');
const pool      = require('../config/db');

const client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

// Shared system prompt for all disease detection
const SYSTEM_PROMPT = `You are an expert plant pathologist and agricultural scientist 
specializing in Maharashtra, India crop diseases. You have deep knowledge of:
- Crops: soybean, cotton, sugarcane, onion, wheat, jowar, tur dal, grapes, pomegranate
- Common Maharashtra diseases: Yellow Mosaic Virus (soybean), Pink Bollworm (cotton),
  Red Rot (sugarcane), Downy Mildew (onion), Rust (wheat), Anthracnose (grapes)
- Organic and chemical treatments available in Indian markets
- Government schemes for crop loss compensation

Always respond in this exact JSON format (no extra text):
{
  "disease_name": "exact disease name",
  "confidence": "high/medium/low",
  "affected_crop": "crop name",
  "severity": "mild/moderate/severe",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "cause": "brief cause explanation",
  "treatment": {
    "immediate": ["action 1", "action 2"],
    "chemical": ["product name and dosage"],
    "organic": ["organic treatment option"],
    "preventive": ["future prevention tip"]
  },
  "spread_risk": "low/medium/high",
  "yield_impact": "estimated % yield loss if untreated",
  "consult_expert": true/false,
  "additional_notes": "any important extra information"
}`;

// ── POST /api/disease/detect ───────────────────────────────
// Farmer uploads a photo of their sick crop → Claude analyses it
// multipart/form-data: image file + crop (optional) + district (from token)
exports.detectFromImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No image uploaded.' });

    const crop     = req.body.crop || 'unknown crop';
    const district = req.user.district;

    // Convert the image buffer to base64 so we can send it to Claude
    const imageBase64 = req.file.buffer.toString('base64');
    const mediaType   = req.file.mimetype; // e.g. "image/jpeg"

    // Send image + text prompt to Claude vision
    const response = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages: [{
        role:    'user',
        content: [
          {
            type:   'image',
            source: { type: 'base64', media_type: mediaType, data: imageBase64 }
          },
          {
            type: 'text',
            text: `This is a photo of a ${crop} plant from ${district} district, Maharashtra.
Please diagnose any disease you can see. Respond ONLY with the JSON format specified.`
          }
        ]
      }]
    });

    // Parse Claude's JSON response
    let diagnosis;
    try {
      const text = response.content[0].text.trim();
      // Strip markdown code fences if Claude wrapped the JSON in them
      const clean = text.replace(/```json|```/g, '').trim();
      diagnosis = JSON.parse(clean);
    } catch {
      // If JSON parsing fails, return Claude's raw text
      return res.json({
        success:   true,
        data:      { raw_response: response.content[0].text },
        parsed:    false
      });
    }

    // Save to DB for history
    await pool.query(
      `INSERT INTO disease_detections
         (user_id, district, crop, detection_method, disease_name,
          confidence, severity, treatment, raw_response)
       VALUES ($1,$2,$3,'image',$4,$5,$6,$7,$8)`,
      [
        req.user.id, district, crop,
        diagnosis.disease_name, diagnosis.confidence,
        diagnosis.severity,     JSON.stringify(diagnosis.treatment),
        JSON.stringify(diagnosis)
      ]
    ).catch(() => {}); // don't fail if DB insert fails

    res.json({ success: true, data: diagnosis });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Disease detection failed. Try again.' });
  }
};

// ── POST /api/disease/symptoms ────────────────────────────
// Farmer describes symptoms in text → Claude diagnoses
// Body: { crop, symptoms, duration_days, affected_area_percent }
exports.detectFromSymptoms = async (req, res) => {
  try {
    const { crop, symptoms, duration_days, affected_area_percent } = req.body;
    if (!crop || !symptoms)
      return res.status(400).json({ success: false, error: 'crop and symptoms are required.' });

    const prompt = `A farmer in ${req.user.district} district, Maharashtra is growing ${crop}.

Symptoms they are seeing:
${symptoms}

Additional info:
- Duration: ${duration_days || 'unknown'} days
- Affected area: ${affected_area_percent || 'unknown'}% of the field

Based on these symptoms, diagnose the disease. Respond ONLY with the JSON format specified.`;

    const response = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: prompt }]
    });

    let diagnosis;
    try {
      const clean = response.content[0].text.trim().replace(/```json|```/g, '').trim();
      diagnosis = JSON.parse(clean);
    } catch {
      return res.json({ success: true, data: { raw_response: response.content[0].text }, parsed: false });
    }

    // Save to history
    await pool.query(
      `INSERT INTO disease_detections
         (user_id, district, crop, detection_method, disease_name,
          confidence, severity, treatment, raw_response)
       VALUES ($1,$2,$3,'symptoms',$4,$5,$6,$7,$8)`,
      [
        req.user.id, req.user.district, crop,
        diagnosis.disease_name, diagnosis.confidence,
        diagnosis.severity,     JSON.stringify(diagnosis.treatment),
        JSON.stringify(diagnosis)
      ]
    ).catch(() => {});

    res.json({ success: true, data: diagnosis });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Diagnosis failed. Please try again.' });
  }
};

// ── GET /api/disease/history ──────────────────────────────
// Past diagnoses for this user
exports.getHistory = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, crop, detection_method, disease_name,
              confidence, severity, created_at
       FROM disease_detections
       WHERE user_id=$1
       ORDER BY created_at DESC
       LIMIT 20`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/disease/common?crop=Soybean ─────────────────
// Returns common diseases for a specific crop in Maharashtra
// Hardcoded knowledge base — no API call needed
exports.getCommonDiseases = async (req, res) => {
  const diseases = {
    soybean: [
      { name: 'Yellow Mosaic Virus', severity: 'high', season: 'Kharif',
        symptoms: 'Yellow patches on leaves, stunted growth',
        prevention: 'Use resistant varieties, control whitefly population' },
      { name: 'Bacterial Pustule', severity: 'medium', season: 'Kharif',
        symptoms: 'Small yellow-green spots with raised centres',
        prevention: 'Crop rotation, avoid overhead irrigation' },
      { name: 'Rust', severity: 'high', season: 'Late Kharif',
        symptoms: 'Reddish-brown pustules on leaf undersides',
        prevention: 'Early sowing, fungicide application at first sign' }
    ],
    cotton: [
      { name: 'Pink Bollworm', severity: 'high', season: 'Kharif',
        symptoms: 'Damaged bolls, pink larvae inside',
        prevention: 'Bt cotton varieties, pheromone traps' },
      { name: 'Bacterial Blight', severity: 'medium', season: 'Kharif',
        symptoms: 'Angular water-soaked spots on leaves',
        prevention: 'Certified disease-free seeds, avoid overhead irrigation' }
    ],
    sugarcane: [
      { name: 'Red Rot', severity: 'high', season: 'Year-round',
        symptoms: 'Red discolouration inside stalk, sour smell',
        prevention: 'Resistant varieties like Co-86032, healthy seed material' },
      { name: 'Wilt', severity: 'medium', season: 'Summer',
        symptoms: 'Yellowing, drying of leaves, wilting',
        prevention: 'Proper drainage, balanced fertilisation' }
    ],
    onion: [
      { name: 'Downy Mildew', severity: 'high', season: 'Rabi',
        symptoms: 'Pale green to yellow lesions, white fungal growth',
        prevention: 'Avoid dense planting, Mancozeb spray at 7-day intervals' },
      { name: 'Purple Blotch', severity: 'medium', season: 'Rabi',
        symptoms: 'Small white spots with purple centres',
        prevention: 'Iprodione or Mancozeb spray' }
    ],
    wheat: [
      { name: 'Yellow Rust', severity: 'high', season: 'Rabi',
        symptoms: 'Yellow stripe of pustules along leaf veins',
        prevention: 'Resistant varieties, Propiconazole spray' },
      { name: 'Loose Smut', severity: 'medium', season: 'Rabi',
        symptoms: 'Black powder replacing grain',
        prevention: 'Seed treatment with Carboxin + Thiram' }
    ]
  };

  const crop = (req.query.crop || '').toLowerCase();
  const data = diseases[crop] || Object.entries(diseases).map(([c, d]) => ({ crop: c, diseases: d }));

  res.json({ success: true, crop: crop || 'all', data });
};
