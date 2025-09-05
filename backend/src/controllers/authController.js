
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.js';

const sign = (user) => jwt.sign(
  { id: user._id, role: user.role, email: user.email, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

export const register = async (req,res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role==='admin'?'admin':'employee' });
    const token = sign(user);
    res.status(201).json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const login = async (req,res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = sign(user);
    res.json({ token, user: { id:user._id, name:user.name, email:user.email, role:user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
