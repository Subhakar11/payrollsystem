
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import salaryRoutes from './src/routes/salary.js';
import expenseRoutes from './src/routes/expense.js';
import dashboardRoutes from './src/routes/dashboard.js';

dotenv.config();
const app = express();

app.use(cors({ origin: (process.env.CLIENT_ORIGIN || '*').split(','), credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Payroll Management API running'));
app.use('/api/auth', authRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('DB connection error:', err.message);
  process.exit(1);
});
