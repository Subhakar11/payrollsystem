
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
export default function Dashboard(){
  const [series, setSeries] = useState([]);
  const [totals, setTotals] = useState(null);
  const { user } = useAuth();
  useEffect(()=>{
    const run = async () => {
      if (!user) return;
      if (user.role==='admin') {
        const { data } = await api.get('/api/dashboard/admin'); setTotals(data.totals);
      } else {
        const { data } = await api.get('/api/dashboard/me'); setSeries(data.series);
      }
    };
    run();
  },[user]);
  return (
    <div className="page">
      <h1 className="title mb-4">Dashboard</h1>
      {user?.role==='admin' && totals && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card"><div className="text-slate-500 text-sm">Salary Slips</div><div className="text-2xl font-semibold">{totals.totalSlips}</div></div>
          <div className="card"><div className="text-slate-500 text-sm">Expenses Submitted</div><div className="text-2xl font-semibold">{totals.totalExpenseSubmitted}</div></div>
          <div className="card"><div className="text-slate-500 text-sm">Approved</div><div className="text-2xl font-semibold">{totals.approved}</div></div>
          <div className="card"><div className="text-slate-500 text-sm">Rejected</div><div className="text-2xl font-semibold">{totals.rejected}</div></div>
        </div>
      )}
      {user?.role==='employee' && (
        <div className="card">
          <div className="text-slate-700 font-medium mb-2">Salary vs Expenses</div>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <AreaChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" /><YAxis /><Tooltip /><Legend />
                <Area type="monotone" dataKey="salary" />
                <Area type="monotone" dataKey="expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
