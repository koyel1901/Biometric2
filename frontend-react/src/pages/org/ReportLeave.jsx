import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';

const ReportLeave = () => {
  const stats = [
    { name: 'Priya Mehta', sick: 2, casual: 1, total: 3, status: '1 pending' },
    { name: 'Rahul Sharma', sick: 0, casual: 1, total: 1, status: 'approved' },
  ];

  return (
    <DashboardLayout 
      title="Leave Report" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="card-box" style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
        <h4>Generate Leave Report</h4>
        <div className="form-grid" style={{ marginTop: '1rem' }}>
          <div className="form-group"><label className="form-label">From Date</label><input className="form-input" type="date" defaultValue="2026-04-01" /></div>
          <div className="form-group"><label className="form-label">To Date</label><input className="form-input" type="date" defaultValue="2026-04-16" /></div>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-teal">Download CSV</button>
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Leave Statistics</span></div>
        <table>
          <thead>
            <tr><th>Name</th><th>Sick</th><th>Casual</th><th>Total</th><th>Status</th></tr>
          </thead>
          <tbody>
            {stats.map((s, idx) => (
              <tr key={idx}>
                <td>{s.name}</td>
                <td>{s.sick}</td>
                <td>{s.casual}</td>
                <td>{s.total}</td>
                <td><Badge type={s.status.includes('pending') ? 'pending' : 'approved'}>{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ReportLeave;
