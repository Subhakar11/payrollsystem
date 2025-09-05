
import mongoose from 'mongoose';

const salarySlipSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index:true },
  month: { type: Number, min:1, max:12, required: true },
  year: { type: Number, required: true },
  basic: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  net: { type: Number, required: true },
  status: { type: String, enum: ['generated','updated'], default: 'generated' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps:true });

salarySlipSchema.index({ user:1, month:1, year:1 }, { unique:true });
export default mongoose.model('SalarySlip', salarySlipSchema);
