
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
export default function SalarySlips(){
  const [slips, setSlips] = useState([]);
  const load = async () => { const { data } = await api.get('/api/salary/me'); setSlips(data); };
  useEffect(()=>{ load(); },[]);
  const download = (id) => {
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_BASE }/api/salary/${id}/pdf`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.blob()).then(blob=>{
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'salary-slip.pdf';
        a.click();
        URL.revokeObjectURL(a.href);
      });
  };
  return (
    <div className="page">
      <h1 className="title mb-4">My Salary Slips</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slips.map(s=>(
          <div key={s._id} className="card">
            <div className="text-sm text-slate-500">{String(s.month).padStart(2,'0')}/{s.year}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>Basic</div><div className="text-right font-medium">₹{s.basic}</div>
              <div>Allowances</div><div className="text-right font-medium">₹{s.allowances}</div>
              <div>Deductions</div><div className="text-right font-medium">₹{s.deductions}</div>
              <div className="font-semibold">Net</div><div className="text-right font-semibold">₹{s.net}</div>
            </div>
            <div className="mt-3 flex justify-end">
              <button className="btn btn-outline" onClick={()=>download(s._id)}>Download PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
