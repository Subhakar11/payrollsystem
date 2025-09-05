
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
export default function ReviewExpenses(){
  const [list,setList] = useState([]);
  const load = async () => { const { data } = await api.get('/api/expenses/all'); setList(data); };
  useEffect(()=>{ load(); },[]);
  const setStatus = async (id,status) => { await api.patch(`/api/expenses/${id}/status`, { status }); load(); };
  return (
    <div className="page">
      <h1 className="title mb-4">Review Expenses</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th>Employee</th><th>Period</th><th>Total</th><th>Status</th><th>Items</th><th>Action</th></tr></thead>
          <tbody>
            {list.map(e=>(
              <tr key={e._id} className="border-t">
                <td>{e.user?.name}<div className="text-xs text-slate-500">{e.user?.email}</div></td>
                <td>{String(e.month).padStart(2,'0')}/{e.year}</td>
                <td>₹{e.total}</td>
                <td className="capitalize">{e.status}</td>
                <td>
                  <details><summary>View ({e.items.length})</summary>
                    <ul className="list-disc ml-5">
                      {e.items.map((i,idx)=>(<li key={idx}>{i.description} - ₹{i.amount} on {new Date(i.date).toLocaleDateString()}</li>))}
                    </ul>
                  </details>
                </td>
                <td className="space-x-2">
                  <button className="btn btn-outline" onClick={()=>setStatus(e._id,'approved')}>Approve</button>
                  <button className="btn btn-outline" onClick={()=>setStatus(e._id,'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
