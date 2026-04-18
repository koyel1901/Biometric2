import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';


const Today = () => {
  const [view, setView] = useState('main'); // 'main', 'manual'

  return (
    <DashboardLayout 
      title="Today Attendance" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      {view === 'main' && (
        <div id="today-att-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, color: 'var(--text)' }}>Daily Overview</h3>
            <button className="btn btn-teal" onClick={() => setView('manual')}>Manual Entry +</button>
          </div>
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card green"><div className="stat-label">Present</div><div className="stat-value">132</div></div>
            <div className="stat-card red"><div className="stat-label">Absent</div><div className="stat-value">18</div></div>
            <div className="stat-card amber"><div className="stat-label">Late</div><div className="stat-value">6</div></div>
          </div>
          <div className="card-box">
            <h4>Present employees</h4>
            <table style={{ width: '100%' }}>
              <thead><tr><th>Name</th><th>Check-in</th></tr></thead>
              <tbody>
                <tr><td>Aarav Kumar</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>09:02</td></tr>
                <tr><td>Vikram Nair</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>08:58</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card-box">
            <h4>Late employees</h4>
            <table style={{ width: '100%' }}>
              <thead><tr><th>Name</th><th>Check-in</th></tr></thead>
              <tbody>
                <tr><td>Sneha Patel</td><td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>09:31 <span className="badge late" style={{ marginLeft: '6px' }}>+31m</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'manual' && (
        <div id="manual-entry-form">
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setView('main')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} />
              Back to Overview
            </button>
          </div>
          <div className="card-box" style={{ maxWidth: '500px' }}>

            <h4>Manual Attendance Entry</h4>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group"><label className="form-label">Employee</label><select className="form-select"><option>Aarav Kumar (EMP-001)</option><option>Priya Mehta (EMP-002)</option><option>Sneha Patel (EMP-004)</option></select></div>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" defaultValue="2026-04-17" /></div>
              <div className="form-group"><label className="form-label">Time</label><input className="form-input" type="time" defaultValue="09:00" /></div>
              <div className="form-group"><label className="form-label">Record Type</label><select className="form-select"><option>IN</option><option>OUT</option></select></div>
              <div className="form-group"><label className="form-label">Reason</label><input className="form-input" placeholder="e.g. Machine malfunction" /></div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button className="btn btn-teal" onClick={() => setView('main')}>Submit Entry</button>
                <button className="btn btn-ghost" onClick={() => setView('main')}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Today;
