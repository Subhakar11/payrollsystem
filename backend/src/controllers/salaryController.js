
import SalarySlip from '../models/SalarySlip.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';

export const upsertSlip = async (req,res) => {
  try {
    const { userId, month, year, basic, allowances=0, deductions=0 } = req.body;
    if (!userId || !month || !year || basic==null) return res.status(400).json({ message: 'Missing fields' });
    const employee = await User.findById(userId);
    if (!employee) return res.status(404).json({ message: 'User not found' });
    const net = Number(basic) + Number(allowances) - Number(deductions);
    const slip = await SalarySlip.findOneAndUpdate(
      { user: userId, month, year },
      { basic, allowances, deductions, net, status:'updated', updatedBy: req.user.id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(slip);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const getMySlips = async (req,res) => {
  try {
    const slips = await SalarySlip.find({ user: req.user.id }).sort({ year:-1, month:-1 });
    res.json(slips);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const listSlips = async (req,res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { user: userId } : {};
    const slips = await SalarySlip.find(query).populate('user','name email').sort({ year:-1, month:-1 });
    res.json(slips);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const slipPdf = async (req,res) => {
  try {
    const { id } = req.params;
    const slip = await SalarySlip.findById(id).populate('user','name email');
    if (!slip) return res.status(404).json({ message: 'Slip not found' });
    // Authorization: admin or owner
    if (req.user.role !== 'admin' && String(req.user.id) !== String(slip.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="salary-slip-${slip.year}-${String(slip.month).padStart(2,'0')}.pdf"`);
    doc.pipe(res);

    // Header
    doc.fontSize(18).text('Company Pvt. Ltd.', { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(12).text('Salary Slip', { align: 'center' });
    doc.moveDown();

    // Employee & Period
    doc.fontSize(11);
    doc.text(`Employee: ${slip.user.name}`);
    doc.text(`Email: ${slip.user.email}`);
    doc.text(`Period: ${String(slip.month).padStart(2,'0')}/${slip.year}`);
    doc.moveDown();

    // Table-like layout
    const rows = [
      ['Basic', `₹${slip.basic.toFixed(2)}`],
      ['Allowances', `₹${slip.allowances.toFixed(2)}`],
      ['Deductions', `₹${slip.deductions.toFixed(2)}`],
      ['Net Pay', `₹${slip.net.toFixed(2)}`],
    ];
    const startX = 60;
    let y = doc.y;
    doc.fontSize(11).text('Earnings / Deductions', startX, y, { continued: true });
    doc.text('Amount', 380, y);
    y += 20;
    doc.moveTo(startX, y).lineTo(540, y).stroke();
    y += 10;
    rows.forEach(([label, val]) => {
      doc.text(label, startX, y, { width: 300 });
      doc.text(val, 380, y);
      y += 20;
    });
    doc.moveDown(2);
    doc.fontSize(10).fillColor('gray').text('This is a system generated document and does not require a signature.', { align: 'center' });
    doc.end();
  } catch (e) { res.status(500).json({ message: e.message }); }
};
