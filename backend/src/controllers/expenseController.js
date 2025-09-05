
import Expense from '../models/Expense.js';

export const submitOrUpdate = async (req,res) => {
  try {
    const { month, year, items=[] } = req.body;
    if (!month || !year) return res.status(400).json({ message: 'Missing fields' });
    const total = items.reduce((s,i)=>s+Number(i.amount||0),0);
    const doc = await Expense.findOneAndUpdate(
      { user: req.user.id, month, year },
      { items, total, status:'submitted' },
      { upsert:true, new:true, setDefaultsOnInsert:true }
    );
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const myExpense = async (req,res) => {
  try {
    const { month, year } = req.query;
    const q = { user: req.user.id };
    if (month) q.month = Number(month);
    if (year) q.year = Number(year);
    const docs = await Expense.find(q).sort({ year:-1, month:-1 });
    res.json(docs);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const listAll = async (req,res) => {
  try {
    const { status } = req.query;
    const q = status ? { status } : {};
    const docs = await Expense.find(q).populate('user','name email');
    res.json(docs);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const setStatus = async (req,res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved','rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const doc = await Expense.findByIdAndUpdate(id, { status }, { new:true });
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
};
