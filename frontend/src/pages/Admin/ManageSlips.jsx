
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
export default function ManageSlips(){
  const [slips, setSlips] = useState([]);
  const [form, setForm] = useState({ userId:'', month:'', year:'', basic:'', allowances:'', deductions:'' });
  const [msg, setMsg] = useState('');
  const load = async () => { const { data } = await api.get('/api/salary/all'); setSlips(data); };
  useEffect(()=>{ load(); },[]);
  const upsert = async () => {
    setMsg('');
    try {
      const payload={...form, month:Number(form.month), year:Number(form.year), basic:Number(form.basic||0), allowances:Number(form.allowances||0), deductions:Number(form.deductions||0)};
      await api.post('/api/salary/upsert', payload); setMsg('Saved'); setForm({ userId:'', month:'', year:'', basic:'', allowances:'', deductions:'' }); load();
    } catch (e){ setMsg(e.response?.data?.message || 'Error'); }
  };
  const download = (id) => {
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_BASE }/api/salary/${id}/pdf`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.blob()).then(blob=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='salary-slip.pdf'; a.click(); URL.revokeObjectURL(a.href); });
  };
  return (
    <div className="page">
      <h1 className="title mb-4">Manage Salary Slips</h1>
      <div className="card mb-6">
        <div className="grid sm:grid-cols-3 gap-3">
          <div><div className="label">Employee ID</div><input className="input" value={form.userId} onChange={e=>setForm({...form, userId:e.target.value})} placeholder="Mongo _id of employee" /></div>
          <div><div className="label">Month</div><input className="input" type="number" value={form.month} onChange={e=>setForm({...form, month:e.target.value})} /></div>
          <div><div className="label">Year</div><input className="input" type="number" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} /></div>
          <div><div className="label">Basic</div><input className="input" type="number" value={form.basic} onChange={e=>setForm({...form, basic:e.target.value})} /></div>
          <div><div className="label">Allowances</div><input className="input" type="number" value={form.allowances} onChange={e=>setForm({...form, allowances:e.target.value})} /></div>
          <div><div className="label">Deductions</div><input className="input" type="number" value={form.deductions} onChange={e=>setForm({...form, deductions:e.target.value})} /></div>
        </div>
        <div className="mt-3"><button className="btn btn-primary" onClick={upsert}>Generate / Update</button> <span className="text-sm text-slate-600">{msg}</span></div>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500"><th>Employee</th><th>Period</th><th>Net</th><th>Updated</th><th></th></tr></thead>
            <tbody>
              {slips.map(s=>(
                <tr key={s._id} className="border-t">
                  <td>{s.user?.name}<div className="text-xs text-slate-500">{s.user?.email}</div></td>
                  <td>{String(s.month).padStart(2,'0')}/{s.year}</td>
                  <td>₹{s.net}</td>
                  <td>{new Date(s.updatedAt).toLocaleString()}</td>
                  <td><button className="btn btn-outline" onClick={()=>download(s._id)}>PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
