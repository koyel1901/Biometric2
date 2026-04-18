import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';


const Holidays = () => {
  const [view, setView] = useState('list'); // 'list', 'add'

  const holidays = [
    { id: 1, name: 'Ram Navami', date: '6 Apr 2026', day: 'Monday' },
    { id: 2, name: 'Mahavir Jayanti', date: '10 Apr 2026', day: 'Friday' },
    { id: 3, name: 'Independence Day', date: '15 Aug 2026', day: 'Saturday' },
    { id: 4, name: 'Diwali', date: '20 Oct 2026', day: 'Tuesday' },
  ];

  return (
    <DashboardLayout 
      title="Holidays" 
      role="superadmin" 
      label="Tenant Admin" 
      abbr="TA" 
      color="#a855f7" 
      bgColor="rgba(168,85,247,0.15)"
    >
      {view === 'list' && (
        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Company Holidays</span>
            <button className="btn btn-teal" onClick={() => setView('add')}>+ Add Holiday</button>
          </div>
          <table>
            <thead>
              <tr><th>Holiday</th><th>Date</th><th>Day</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {holidays.map(h => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{h.date}</td>
                  <td>{h.day}</td>
                  <td style={{ display: 'flex', gap: '6px', padding: '0.85rem 0' }}>
                    <button className="btn btn-ghost">Edit</button>
                    <button className="btn btn-red" style={{ padding: '0.5rem 0.8rem' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'add' && (
        <div id="holiday-add-view">
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} />
              Back to Holidays
            </button>
          </div>
          <div className="card-box" style={{ maxWidth: '500px' }}>

          <h4>Add New Holiday</h4>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group"><label className="form-label">Holiday Name</label><input className="form-input" placeholder="e.g. Eid al-Fitr" /></div>
            <div className="form-grid">
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" /></div>
              <div className="form-group"><label className="form-label">Type</label><select className="form-select"><option>National</option><option>Regional</option><option>Optional</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Description (optional)</label><textarea className="form-input" style={{ height: '80px', resize: 'none' }} placeholder="Short description..."></textarea></div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-teal" onClick={() => setView('list')}>Save Holiday</button>
              <button className="btn btn-ghost" onClick={() => setView('list')}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    )}



    </DashboardLayout>
  );
};

export default Holidays;
