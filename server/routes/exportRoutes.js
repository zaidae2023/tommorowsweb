const express = require('express');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Expense = require('../models/expense');
const Service = require('../models/service');
const User = require('../models/user'); //  Import user model

const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Helper middleware for checking export limits
const checkExportLimit = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user.plan === 'free' && user.exportsUsed >= 3) {
    return res.status(403).json({ message: 'Export limit reached. Upgrade to Premium to unlock unlimited exports.' });
  }
  req.userDoc = user; // attach full user doc for later updates
  next();
};

//  Export Expenses CSV
router.get('/expenses/csv', checkExportLimit, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).populate('vehicleId', 'name model year');
    const fields = ['type', 'amount', 'currency', 'note', 'date', 'vehicleId.name', 'vehicleId.model', 'vehicleId.year'];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);
    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');

    //  Increment exportsUsed for free user
    if (req.userDoc.plan === 'free') {
      req.userDoc.exportsUsed += 1;
      await req.userDoc.save();
    }

    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'CSV export failed', error: err.message });
  }
});

//  Export Services CSV
router.get('/services/csv', checkExportLimit, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.userId }).populate('vehicleId', 'name model year');
    const fields = ['type', 'date', 'note', 'status', 'vehicleId.name', 'vehicleId.model', 'vehicleId.year'];
    const parser = new Parser({ fields });
    const csv = parser.parse(services);
    res.header('Content-Type', 'text/csv');
    res.attachment('services.csv');

    if (req.userDoc.plan === 'free') {
      req.userDoc.exportsUsed += 1;
      await req.userDoc.save();
    }

    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'CSV export failed', error: err.message });
  }
});

// Export Services PDF
router.get('/services/pdf', checkExportLimit, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.userId }).populate('vehicleId', 'name model year');
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=services.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Service Records', { underline: true }).moveDown();

    services.forEach((svc, i) => {
      const date = svc.date ? new Date(svc.date).toLocaleDateString() : 'N/A';
      const vehicle = svc.vehicleId ? `${svc.vehicleId.name} – ${svc.vehicleId.model} (${svc.vehicleId.year})` : 'N/A';
      const type = svc.type || 'N/A';
      const note = svc.note || 'N/A';
      const status = svc.status || 'upcoming';

      doc
        .fontSize(12)
        .text(`${i + 1}. ${type} - ${status}\nDate: ${date}\nVehicle: ${vehicle}\nNote: ${note}`)
        .moveDown();
    });

    doc.end();

    if (req.userDoc.plan === 'free') {
      req.userDoc.exportsUsed += 1;
      await req.userDoc.save();
    }
  } catch (err) {
    res.status(500).json({ message: 'PDF export failed', error: err.message });
  }
});

// Export Expenses PDF
router.get('/expenses/pdf', checkExportLimit, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).populate('vehicleId', 'name model year');
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Expense Records', { underline: true }).moveDown();

    expenses.forEach((exp, i) => {
      const date = exp.date ? new Date(exp.date).toLocaleDateString() : 'N/A';
      const vehicle = exp.vehicleId ? `${exp.vehicleId.name} – ${exp.vehicleId.model} (${exp.vehicleId.year})` : 'N/A';
      const type = exp.type || 'N/A';
      const note = exp.note || 'N/A';
      const amount = exp.amount || 0;
      const currency = exp.currency || 'USD';

      doc
        .fontSize(12)
        .text(`${i + 1}. ${type} - ${amount} ${currency}\nDate: ${date}\nVehicle: ${vehicle}\nNote: ${note}`)
        .moveDown();
    });

    doc.end();

    if (req.userDoc.plan === 'free') {
      req.userDoc.exportsUsed += 1;
      await req.userDoc.save();
    }
  } catch (err) {
    res.status(500).json({ message: 'PDF export failed', error: err.message });
  }
});

module.exports = router;
