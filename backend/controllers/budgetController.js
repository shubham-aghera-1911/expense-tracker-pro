const Budget = require('../models/Budget');
const User = require('../models/User');
const Expense = require('../models/Expense');
const { asyncHandler } = require('../middleware/auth');
const { convert } = require('../utils/currency');

// @desc    Get overall + category budgets with current spend, for alerting
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7); // YYYY-MM
  const targetCurrency = req.user.baseCurrency;

  const [year, monthNum] = month.split('-').map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

  const [categoryBudgets, expenses] = await Promise.all([
    Budget.find({ user: req.user._id, month }),
    Expense.find({ user: req.user._id, date: { $gte: startOfMonth, $lte: endOfMonth } }),
  ]);

  let totalSpend = 0;
  const spendByCategory = {};

  for (const exp of expenses) {
    const converted = await convert(exp.amount, exp.currency, targetCurrency);
    totalSpend += converted;
    spendByCategory[exp.category] = (spendByCategory[exp.category] || 0) + converted;
  }

  const categoryBreakdown = categoryBudgets.map((b) => {
    const spent = spendByCategory[b.category] || 0;
    return {
      category: b.category,
      limit: b.limit,
      spent: Math.round(spent * 100) / 100,
      percentUsed: b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0,
    };
  });

  const overallLimit = req.user.monthlyBudget || 0;

  res.json({
    success: true,
    data: {
      month,
      currency: targetCurrency,
      overall: {
        limit: overallLimit,
        spent: Math.round(totalSpend * 100) / 100,
        percentUsed: overallLimit > 0 ? Math.round((totalSpend / overallLimit) * 100) : 0,
      },
      categories: categoryBreakdown,
    },
  });
});

// @desc    Set/update a category budget for a month
// @route   POST /api/budgets
// @access  Private
const setBudget = asyncHandler(async (req, res) => {
  const { category, limit, month } = req.body;
  const targetMonth = month || new Date().toISOString().slice(0, 7);

  if (!category || limit === undefined) {
    return res.status(400).json({ success: false, message: 'Category and limit are required' });
  }

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category, month: targetMonth },
    { limit },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json({ success: true, message: 'Budget saved', data: { budget } });
});

// @desc    Delete a category budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) {
    return res.status(404).json({ success: false, message: 'Budget not found' });
  }
  res.json({ success: true, message: 'Budget removed' });
});

module.exports = { getBudgets, setBudget, deleteBudget };
