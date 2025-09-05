
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
const currentMonth = new Date().getMonth()+1;
const currentYear = new Date().getFullYear();
export default function Expenses(){
  const [month,setMonth] = useState(currentMonth);
  const [year,setYear] = useState(currentYear);
  const [items,setItems] = useState([{ description:'', amount:'', date: new Date().toISOString().slice(0,10) }]);
  const [list,setList] = useState([]);
  const [msg,setMsg] = useState('');
  const addRow = () => setItems([...items,{ description:'', amount:'', date: new Date().toISOString().slice(0,10) }]);
  const removeRow = (i) => setItems(items.filter((_,idx)=>idx!==i));
  const save = async () => {
    const payload = { month:Number(month), year:Number(year), items: items.filter(i=>i.description && i.amount) };
    try { await api.post('/api/expenses/submit', payload); setMsg('Saved!'); load(); }
    catch (e) { setMsg(e.response?.data?.message || 'Error'); }
  };
  const load = async () => { const { data } = await api.get('/api/expenses/me'); setList(data); };
  useEffect(()=>{ load(); },[]);
  const total = items.reduce((s,i)=> s + Number(i.amount||0), 0);
  return (
    <div className="page">
      <h1 className="title mb-4">Monthly Expenses</h1>
      <div className="card mb-6">
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div><div className="label">Month</div><input className="input" type="number" min="1" max="12" value={month} onChange={e=>setMonth(e.target.value)} /></div>
          <div><div className="label">Year</div><input className="input" type="number" value={year} onChange={e=>setYear(e.target.value)} /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500"><th>Description</th><th>Amount</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {items.map((row,i)=>(
                <tr key={i} className="border-t">
                  <td><input className="input" value={row.description} onChange={e=>{const c=[...items]; c[i].description=e.target.value; setItems(c);}}/></td>
                  <td><input className="input" type="number" value={row.amount} onChange={e=>{const c=[...items]; c[i].amount=e.target.value; setItems(c);}}/></td>
                  <td><input className="input" type="date" value={row.date} onChange={e=>{const c=[...items]; c[i].date=e.target.value; setItems(c);}}/></td>
                  <td><button className="btn btn-outline" onClick={()=>removeRow(i)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-3">
          <button className="btn btn-outline" onClick={addRow}>+ Add Row</button>
          <div className="text-slate-700">Total: <span className="font-semibold">₹{total}</span></div>
        </div>
        <div className="mt-4 flex gap-2"><button className="btn btn-primary" onClick={save}>Submit</button><span className="text-sm text-slate-600">{msg}</span></div>
      </div>
      <div className="card">
        <div className="text-slate-700 font-medium mb-2">My Submissions</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-slate-500"><th>Period</th><th>Total</th><th>Status</th><th>Items</th></tr></thead>
            <tbody>
              {list.map(e=>(
                <tr key={e._id} className="border-t">
                  <td>{String(e.month).padStart(2,'0')}/{e.year}</td>
                  <td>₹{e.total}</td>
                  <td className="capitalize">{e.status}</td>
                  <td>{e.items.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
