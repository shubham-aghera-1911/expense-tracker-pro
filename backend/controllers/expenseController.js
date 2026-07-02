const Expense = require('../models/Expense');
const { asyncHandler } = require('../middleware/auth');
const { convert } = require('../utils/currency');

// @desc    Get all expenses for logged in user, with filters + pagination
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const {
    category,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 20,
    sortBy = 'date',
    order = 'desc',
  } = req.query;

  const query = { user: req.user._id };

  if (category && category !== 'All') query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = order === 'asc' ? 1 : -1;

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limitNum),
    Expense.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      expenses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    },
  });
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }
  res.json({ success: true, data: { expense } });
});

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, currency, category, note, date, paymentMethod } = req.body;

  if (!title || !amount) {
    return res.status(400).json({ success: false, message: 'Title and amount are required' });
  }

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    currency: currency || req.user.baseCurrency,
    category,
    note,
    date: date || Date.now(),
    paymentMethod,
  });

  res.status(201).json({ success: true, message: 'Expense added', data: { expense } });
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }

  const allowedFields = ['title', 'amount', 'currency', 'category', 'note', 'date', 'paymentMethod'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) expense[field] = req.body[field];
  });

  await expense.save();

  res.json({ success: true, message: 'Expense updated', data: { expense } });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }
  res.json({ success: true, message: 'Expense deleted' });
});

// @desc    Get list of available categories
// @route   GET /api/expenses/meta/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { categories: Expense.CATEGORIES } });
});

// @desc    Get summary stats (totals converted into a target currency)
// @route   GET /api/expenses/meta/summary
// @access  Private
const getSummary = asyncHandler(async (req, res) => {
  const targetCurrency = req.query.currency || req.user.baseCurrency;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const expenses = await Expense.find({
    user: req.user._id,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  let totalThisMonth = 0;
  const byCategory = {};

  for (const exp of expenses) {
    const converted = await convert(exp.amount, exp.currency, targetCurrency);
    totalThisMonth += converted;
    byCategory[exp.category] = (byCategory[exp.category] || 0) + converted;
  }

  res.json({
    success: true,
    data: {
      currency: targetCurrency,
      totalThisMonth: Math.round(totalThisMonth * 100) / 100,
      byCategory: Object.fromEntries(
        Object.entries(byCategory).map(([k, v]) => [k, Math.round(v * 100) / 100])
      ),
      expenseCount: expenses.length,
    },
  });
});

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getCategories,
  getSummary,
};
