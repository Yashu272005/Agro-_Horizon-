// ── Disease Detector Routes ─────────────────────────────────
// Powers the disease detection feature
// Accepts a crop image or symptom description → returns diagnosis
const router      = require('express').Router();
const c           = require('../controllers/diseaseController');
const { protect } = require('../middleware/auth');
const multer      = require('multer');

// multer stores the uploaded image in memory (as a Buffer)
// so we can send it to Claude's vision API without saving to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },  // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, and WebP images are allowed.'));
  }
});

// POST /api/disease/detect  — upload image → get diagnosis
router.post('/detect',   protect, upload.single('image'), c.detectFromImage);

// POST /api/disease/symptoms  — describe symptoms in text → get diagnosis
router.post('/symptoms', protect, c.detectFromSymptoms);

// GET  /api/disease/history  — past detections for this user
router.get('/history',   protect, c.getHistory);

// GET  /api/disease/common?crop=Soybean  — common diseases for a crop
router.get('/common',    protect, c.getCommonDiseases);

module.exports = router;
