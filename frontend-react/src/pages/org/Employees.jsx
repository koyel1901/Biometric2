import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

import Badge from '../../components/Badge';

const Employees = () => {
  const [view, setView] = useState('list'); // 'list', 'add'

  const employees = [
    { id: 'EMP-001', name: 'Aarav Kumar', fp: 'FP-045', status: 'active' },
    { id: 'EMP-002', name: 'Priya Mehta', fp: 'FP-046', status: 'active' },
    { id: 'EMP-003', name: 'Rahul Sharma', fp: 'FP-047', status: 'inactive' },
    { id: 'EMP-004', name: 'Sneha Patel', fp: 'FP-048', status: 'active' },
    { id: 'EMP-005', name: 'Vikram Nair', fp: 'FP-049', status: 'active' },
  ];

  return (
    <DashboardLayout 
      title="All Employees" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      {view === 'list' && (
        <div id="emp-list-view">
          <div className="table-wrap">
            <div className="table-header">
              <span className="table-title">Employee Registry</span>
              <button className="btn btn-teal" onClick={() => setView('add')}>+ Add</button>
            </div>
            <table>
              <thead>
                <tr><th>Emp ID</th><th>Name</th><th>FP ID</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: 'var(--mono)' }}>{e.id}</td>
                    <td>{e.name}</td>
                    <td style={{ fontFamily: 'var(--mono)' }}>{e.fp}</td>
                    <td><Badge type={e.status}>{e.status}</Badge></td>
                    <td style={{ display: 'flex', gap: '6px', padding: '0.85rem 0' }}>
                      <button className="btn btn-ghost">View</button>
                      <button className="btn btn-ghost">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'add' && (
        <div id="add-emp-view">
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} />
              Back to Employees
            </button>
          </div>
          <div className="card-box" style={{ maxWidth: '600px' }}>

            <h4>Add New Employee</h4>
            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="e.g. Aarav Kumar" /></div>
              <div className="form-group"><label className="form-label">Email (optional)</label><input className="form-input" placeholder="employee@org.com" /></div>
              <div className="form-group"><label className="form-label">Phone (optional)</label><input className="form-input" placeholder="+91 9876543210" /></div>
              <div className="form-group"><label className="form-label">Fingerprint ID</label><select className="form-select"><option>FP-050 (available)</option><option>FP-051 (available)</option><option>FP-052 (available)</option></select></div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-teal" onClick={() => setView('list')}>Register Employee</button>
              <button className="btn btn-ghost" onClick={() => setView('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Employees;
