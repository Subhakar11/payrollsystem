
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true }
},{ _id:false });

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index:true },
  month: { type: Number, min:1, max:12, required: true },
  year: { type: Number, required: true },
  items: { type: [itemSchema], default: [] },
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['submitted','approved','rejected'], default: 'submitted' }
},{ timestamps:true });

expenseSchema.index({ user:1, month:1, year:1 }, { unique:true });
export default mongoose.model('Expense', expenseSchema);
