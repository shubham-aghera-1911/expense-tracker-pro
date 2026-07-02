const express = require('express');
const { getMonthlyReport, getTrend, exportPdf } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlyReport);
router.get('/trend', getTrend);
router.get('/export/pdf', exportPdf);

module.exports = router;
