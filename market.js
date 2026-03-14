// ── Market Intelligence Routes ──────────────────────────────
// Powers the MarketIntelligence.tsx page
const router      = require('express').Router();
const c           = require('../controllers/marketController');
const { protect } = require('../middleware/auth');

router.get('/prices',          protect, c.getLivePrices);    // live mandi prices from Agmarknet
router.get('/prices/history',  protect, c.getPriceHistory);  // price trend chart data
router.get('/prices/compare',  protect, c.comparecrops);     // compare prices across crops
router.get('/mandis',          protect, c.getMandis);        // nearby mandis list
router.get('/insights',        protect, c.getInsights);      // AI price insights for district

module.exports = router;
