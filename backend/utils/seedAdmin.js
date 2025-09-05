
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import { connectDB } from '../src/config/db.js';

const run = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) { console.log('Set ADMIN_EMAIL and ADMIN_PASSWORD'); process.exit(1); }
  let user = await User.findOne({ email });
  if (user) console.log('Admin exists:', email);
  else {
    const hash = await bcrypt.hash(password, 10);
    user = await User.create({ name:'Administrator', email, password:hash, role:'admin' });
    console.log('Admin created:', email);
  }
  process.exit(0);
};
run();
