import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

import Badge from '../../components/Badge';

const Leaves = () => {
  const [view, setView] = useState('list'); // 'list', 'apply'

  const leaves = [
    { type: 'Sick', from: '12 Apr', to: '13 Apr', reason: 'Fever', status: 'approved' },
    { type: 'Casual', from: '20 Apr', to: '20 Apr', reason: 'Personal work', status: 'pending' },
  ];

  return (
    <DashboardLayout 
      title="Leave List" 
      role="user" 
      label="Employee" 
      abbr="EM" 
      color="#f59e0b" 
      bgColor="rgba(245,158,11,0.15)"
    >
      {view === 'list' && (
        <div id="leaves-list-view">
          <div className="table-wrap">
            <div className="table-header">
              <span className="table-title">My Leaves</span>
              <button className="btn btn-teal" onClick={() => setView('apply')}>+ Apply Leave</button>
            </div>
            <table>
              <thead>
                <tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr>
              </thead>
              <tbody>
                {leaves.map((l, idx) => (
                  <tr key={idx}>
                    <td>{l.type}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{l.from}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{l.to}</td>
                    <td>{l.reason}</td>
                    <td><Badge type={l.status}>{l.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'apply' && (
        <div id="leaves-apply-view">
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} />
              Back to My Leaves
            </button>
          </div>
          <div className="card-box" style={{ maxWidth: '480px' }}>

            <h4>Apply for Leave</h4>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group"><label className="form-label">Leave Type</label><select className="form-select"><option>Sick</option><option>Casual</option><option>Earned</option></select></div>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">Start Date</label><input className="form-input" type="date" defaultValue="2026-04-20" /></div>
                <div className="form-group"><label className="form-label">End Date</label><input className="form-input" type="date" defaultValue="2026-04-20" /></div>
              </div>
              <div className="form-group"><label className="form-label">Reason</label><textarea className="form-input" rows="3" placeholder="Reason for leave..."></textarea></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn btn-teal" onClick={() => setView('list')}>Submit Request</button>
                <button className="btn btn-ghost" onClick={() => setView('list')}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Leaves;
