const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Expense = require('../models/expense');
const Service = require('../models/service');

router.use(authMiddleware);

// ✅ Export Expenses CSV
router.get('/expenses/csv', async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).populate('vehicleId', 'name model year');
    const fields = ['type', 'amount', 'currency', 'note', 'date', 'vehicleId.name', 'vehicleId.model', 'vehicleId.year'];
    const parser = new Parser({ fields });
    const csv = parser.parse(expenses);
    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'CSV export failed', error: err.message });
  }
});

// ✅ Export Services CSV
router.get('/services/csv', async (req, res) => {
  try {
    const services = await Service.find({ userId: req.userId }).populate('vehicleId', 'name model year');
    const fields = ['type', 'date', 'note', 'status', 'vehicleId.name', 'vehicleId.model', 'vehicleId.year'];
    const parser = new Parser({ fields });
    const csv = parser.parse(services);
    res.header('Content-Type', 'text/csv');
    res.attachment('services.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'CSV export failed', error: err.message });
  }
});

// ✅ Export Services PDF
router.get('/services/pdf', async (req, res) => {
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
        .text(
          `${i + 1}. ${type} - ${status}\nDate: ${date}\nVehicle: ${vehicle}\nNote: ${note}`
        )
        .moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'PDF export failed', error: err.message });
  }
});

// ✅ Export Expenses PDF
router.get('/expenses/pdf', async (req, res) => {
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
        .text(
          `${i + 1}. ${type} - ${amount} ${currency}\nDate: ${date}\nVehicle: ${vehicle}\nNote: ${note}`
        )
        .moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'PDF export failed', error: err.message });
  }
});

module.exports = router;
