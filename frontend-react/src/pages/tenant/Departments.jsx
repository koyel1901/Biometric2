import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';


const Departments = () => {
  const [view, setView] = useState('list'); // 'list', 'add', 'detail'
  const [selectedDept, setSelectedDept] = useState(null);

  const deptEmps = {
    'Engineering': [['EMP-001','Aarav Kumar','Faculty','active'],['EMP-102','Rahul Sharma','Staff','active'],['EMP-304','Sneha Patel','Research','active']],
    'HR': [['EMP-002','Priya Mehta','Admin','active'],['EMP-405','Megha Rao','Manager','active']],
    'Finance': [['EMP-004','Vikram Nair','Accountant','active'],['EMP-506','Sohan Roy','Auditor','active']],
    'Ops': [['EMP-032','Aakash Chauhan','Head','active'],['EMP-900','Divya S.','Staff','active']]
  };

  const depts = [
    { id: 'DEPT-001', name: 'Engineering', head: 'Aditya Rawat', emps: 342, devices: 14, status: 'active' },
    { id: 'DEPT-002', name: 'HR', head: 'Divya Sharma', emps: 218, devices: 9, status: 'active' },
    { id: 'DEPT-003', name: 'Finance', head: 'Mridul Bhardwaj', emps: 187, devices: 7, status: 'suspended' },
    { id: 'DEPT-004', name: 'Ops', head: 'Aakash Chauhan', emps: 156, devices: 6, status: 'active' },
  ];

  const handleViewDept = (dept) => {
    setSelectedDept(dept);
    setView('detail');
  };

  return (
    <DashboardLayout 
      title="Departments" 
      role="superadmin" 
      label="Tenant Admin" 
      abbr="TA" 
      color="#a855f7" 
      bgColor="rgba(168,85,247,0.15)"
    >
      {view === 'list' && (
        <div id="tenants-view">
          <div className="stats-grid">
            <div className="stat-card purple"><div className="stat-label">Total Departments</div><div className="stat-value">24</div></div>
            <div className="stat-card green"><div className="stat-label">Active</div><div className="stat-value">22</div></div>
            <div className="stat-card red"><div className="stat-label">Suspended</div><div className="stat-value">2</div></div>
          </div>
          <div className="table-wrap">
            <div className="table-header">
              <span className="table-title">All Departments</span>
              <button className="btn btn-teal" onClick={() => setView('add')}>+ Add Department</button>
            </div>
            <table>
              <thead>
                <tr><th>Dept ID</th><th>Name</th><th>Employees</th><th>Devices</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {depts.map(d => (
                  <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => handleViewDept(d)}>
                    <td style={{ fontFamily: 'var(--mono)' }}>{d.id}</td>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.emps}</td>
                    <td>{d.devices}</td>
                    <td><Badge type={d.status}>{d.status}</Badge></td>
                    <td><button className="btn btn-ghost">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'detail' && selectedDept && (
        <div id="dept-detail-view">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="btn btn-ghost" onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={18} />
                Back to Departments
              </button>
              <h3 style={{ fontWeight: 600, color: 'var(--text)' }}>{selectedDept.name} Details</h3>
            </div>
            <button className="btn btn-ghost" onClick={() => setView('list')}>← Back to List</button>
          </div>

          
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card purple"><div className="stat-label">Department Head</div><div className="stat-value" style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{selectedDept.head}</div></div>
            <div className="stat-card teal"><div className="stat-label">Total Staff</div><div className="stat-value">{selectedDept.emps}</div></div>
            <div className="stat-card amber">
              <div className="stat-label">Quick Actions</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="btn btn-teal" style={{ flex: 1 }}>Edit</button>
                <button className="btn btn-red" style={{ flex: 1 }}>Suspend</button>
              </div>
            </div>
          </div>

          <div className="table-wrap">
            <div className="table-header"><span className="table-title">Faculty & Employee Roster</span></div>
            <table style={{ width: '100%' }}>
              <thead>
                <tr><th>Emp ID</th><th>Name</th><th>Role</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(deptEmps[selectedDept.name] || []).map((e, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'var(--mono)' }}>{e[0]}</td>
                    <td style={{ fontWeight: 500 }}>{e[1]}</td>
                    <td>{e[2]}</td>
                    <td><Badge type={e[3]}>{e[3]}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'add' && (
        <div id="add-tenant-view">
          <div style={{ marginBottom: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setView('list')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={18} />
              Back to Departments
            </button>
          </div>
          <div className="card-box" style={{ maxWidth: '600px' }}>

            <h4>Register New Department</h4>
            <div className="form-grid" style={{ marginTop: '1rem' }}>
              <div className="form-group"><label className="form-label">Department Name</label><input className="form-input" placeholder="e.g. Engineering" /></div>
              <div className="form-group"><label className="form-label">Head Email</label><input className="form-input" placeholder="head@dept.com" /></div>
              <div className="form-group"><label className="form-label">Max Employees</label><input className="form-input" type="number" placeholder="500" /></div>
              <div className="form-group"><label className="form-label">Max Devices</label><input className="form-input" type="number" placeholder="20" /></div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-teal" onClick={() => setView('list')}>Create Department</button>
              <button className="btn btn-ghost" onClick={() => setView('list')}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Departments;
