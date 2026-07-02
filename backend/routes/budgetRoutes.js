const express = require('express');
const { getBudgets, setBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getBudgets).post(setBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
