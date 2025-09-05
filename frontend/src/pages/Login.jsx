
import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault(); setError('');
    try { const { data } = await api.post('/api/auth/login', { email, password }); login(data.token); nav('/'); }
    catch (e) { setError(e.response?.data?.message || 'Login failed'); }
  };
  return (
    <div className="page">
      <div className="max-w-md mx-auto card">
        <h1 className="title mb-4">Login</h1>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <div><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="btn btn-primary w-full" type="submit">Sign in</button>
        </form>
        <p className="text-sm text-slate-600 mt-3">No account? <Link className="text-blue-600" to="/signup">Create one</Link></p>
      </div>
    </div>
  )
}
