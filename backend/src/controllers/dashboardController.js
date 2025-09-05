
import SalarySlip from '../models/SalarySlip.js';
import Expense from '../models/Expense.js';

export const myStats = async (req,res) => {
  try {
    const slips = await SalarySlip.find({ user: req.user.id });
    const expenses = await Expense.find({ user: req.user.id });
    const byMonth = {};
    for (const s of slips) {
      const key = `${s.year}-${String(s.month).padStart(2,'0')}`;
      byMonth[key] = byMonth[key] || { net:0, expense:0 };
      byMonth[key].net = s.net;
    }
    for (const e of expenses) {
      const key = `${e.year}-${String(e.month).padStart(2,'0')}`;
      byMonth[key] = byMonth[key] || { net:0, expense:0 };
      byMonth[key].expense = e.total;
    }
    const series = Object.keys(byMonth).sort().map(k => ({ period:k, salary:byMonth[k].net, expense:byMonth[k].expense }));
    res.json({ series });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const adminStats = async (req,res) => {
  try {
    const totalSlips = await SalarySlip.countDocuments();
    const totalExpenseSubmitted = await Expense.countDocuments();
    const approved = await Expense.countDocuments({ status:'approved' });
    const rejected = await Expense.countDocuments({ status:'rejected' });
    res.json({ totals: { totalSlips, totalExpenseSubmitted, approved, rejected } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
