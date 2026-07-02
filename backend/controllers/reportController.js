const PDFDocument = require('pdfkit');
const Expense = require('../models/Expense');
const { asyncHandler } = require('../middleware/auth');
const { convert } = require('../utils/currency');

// @desc    Get monthly report data (totals, category breakdown, daily trend)
// @route   GET /api/reports/monthly
// @access  Private
const getMonthlyReport = asyncHandler(async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const targetCurrency = req.query.currency || req.user.baseCurrency;
  const [year, monthNum] = month.split('-').map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

  const expenses = await Expense.find({
    user: req.user._id,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).sort({ date: 1 });

  let total = 0;
  const byCategory = {};
  const byDay = {};

  for (const exp of expenses) {
    const converted = await convert(exp.amount, exp.currency, targetCurrency);
    total += converted;
    byCategory[exp.category] = (byCategory[exp.category] || 0) + converted;
    const day = exp.date.toISOString().slice(0, 10);
    byDay[day] = (byDay[day] || 0) + converted;
  }

  res.json({
    success: true,
    data: {
      month,
      currency: targetCurrency,
      total: Math.round(total * 100) / 100,
      count: expenses.length,
      average: expenses.length ? Math.round((total / expenses.length) * 100) / 100 : 0,
      byCategory: Object.fromEntries(
        Object.entries(byCategory).map(([k, v]) => [k, Math.round(v * 100) / 100])
      ),
      byDay: Object.fromEntries(
        Object.entries(byDay).map(([k, v]) => [k, Math.round(v * 100) / 100])
      ),
    },
  });
});

// @desc    Get trend data across last N months for charting
// @route   GET /api/reports/trend
// @access  Private
const getTrend = asyncHandler(async (req, res) => {
  const months = parseInt(req.query.months, 10) || 6;
  const targetCurrency = req.query.currency || req.user.baseCurrency;
  const now = new Date();
  const results = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const label = d.toISOString().slice(0, 7);

    const expenses = await Expense.find({ user: req.user._id, date: { $gte: start, $lte: end } });
    let total = 0;
    for (const exp of expenses) {
      total += await convert(exp.amount, exp.currency, targetCurrency);
    }

    results.push({ month: label, total: Math.round(total * 100) / 100 });
  }

  res.json({ success: true, data: { currency: targetCurrency, trend: results } });
});

// @desc    Export monthly report as PDF
// @route   GET /api/reports/export/pdf
// @access  Private
const exportPdf = asyncHandler(async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const targetCurrency = req.query.currency || req.user.baseCurrency;
  const [year, monthNum] = month.split('-').map(Number);
  const startOfMonth = new Date(year, monthNum - 1, 1);
  const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

  const expenses = await Expense.find({
    user: req.user._id,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).sort({ date: 1 });

  const currencySymbols = { INR: 'Rs.', USD: '$', EUR: 'EUR', GBP: 'GBP', JPY: 'JPY', AUD: 'A$', CAD: 'C$' };
  const symbol = currencySymbols[targetCurrency] || targetCurrency;

  let total = 0;
  const byCategory = {};
  const rows = [];

  for (const exp of expenses) {
    const converted = await convert(exp.amount, exp.currency, targetCurrency);
    total += converted;
    byCategory[exp.category] = (byCategory[exp.category] || 0) + converted;
    rows.push({
      date: exp.date.toISOString().slice(0, 10),
      title: exp.title,
      category: exp.category,
      amount: converted,
    });
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=expense-report-${month}.pdf`);
  doc.pipe(res);

  // Header
  doc.fontSize(22).fillColor('#4C1D95').text('Expense Tracker Pro', { align: 'left' });
  doc.fontSize(12).fillColor('#555').text(`Monthly Report - ${month}`, { align: 'left' });
  doc.moveDown(0.5);
  doc.strokeColor('#4C1D95').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown();

  // Summary
  doc.fontSize(14).fillColor('#111').text('Summary', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor('#333');
  doc.text(`Total Spent: ${symbol} ${total.toFixed(2)}`);
  doc.text(`Number of Expenses: ${expenses.length}`);
  doc.text(`Average per Expense: ${symbol} ${expenses.length ? (total / expenses.length).toFixed(2) : '0.00'}`);
  doc.moveDown();

  // Category breakdown
  doc.fontSize(14).fillColor('#111').text('By Category', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(11).fillColor('#333');
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, amt]) => {
      doc.text(`${cat}: ${symbol} ${amt.toFixed(2)}`);
    });
  doc.moveDown();

  // Table of expenses
  doc.fontSize(14).fillColor('#111').text('Transactions', { underline: true });
  doc.moveDown(0.5);

  const tableTop = doc.y;
  const colX = { date: 50, title: 130, category: 320, amount: 460 };

  doc.fontSize(10).fillColor('#4C1D95');
  doc.text('Date', colX.date, tableTop);
  doc.text('Title', colX.title, tableTop);
  doc.text('Category', colX.category, tableTop);
  doc.text('Amount', colX.amount, tableTop);
  doc.moveDown(0.3);
  doc.strokeColor('#ddd').lineWidth(0.5).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.3);

  doc.fontSize(9).fillColor('#333');
  rows.forEach((row) => {
    const y = doc.y;
    if (y > 750) {
      doc.addPage();
    }
    const rowY = doc.y;
    doc.text(row.date, colX.date, rowY, { width: 75 });
    doc.text(row.title, colX.title, rowY, { width: 180 });
    doc.text(row.category, colX.category, rowY, { width: 130 });
    doc.text(`${symbol} ${row.amount.toFixed(2)}`, colX.amount, rowY, { width: 85 });
    doc.moveDown(0.5);
  });

  doc.moveDown();
  doc.fontSize(8).fillColor('#999').text(`Generated on ${new Date().toLocaleString()}`, 50, doc.y, { align: 'left' });

  doc.end();
});

module.exports = { getMonthlyReport, getTrend, exportPdf };
