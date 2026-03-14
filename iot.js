const express       = require('express');
const router        = express.Router();
const { protect }   = require('../middleware/auth');
const iotController = require('../controllers/iotController');

router.get('/',                       protect, iotController.getData);
router.get('/data',                   protect, iotController.getData);
router.get('/sensors',                protect, iotController.getSensors);
router.get('/sensors/latest',         protect, iotController.getLatestAll);
router.get('/sensors/:id/history',    protect, iotController.getSensorHistory);
router.get('/alerts',                 protect, iotController.getAlerts);
router.post('/readings',                       iotController.postReading);
router.put('/sensors/:id/thresholds', protect, iotController.setThresholds);

module.exports = router;