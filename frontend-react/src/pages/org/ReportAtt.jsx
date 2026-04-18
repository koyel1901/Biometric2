import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const ReportAtt = () => {
  const summary = [
    { name: 'Aarav Kumar', present: 14, absent: 2, late: 1, percent: '87.5%' },
    { name: 'Sneha Patel', present: 12, absent: 4, late: 3, percent: '75%' },
    { name: 'Vikram Nair', present: 15, absent: 1, late: 0, percent: '93.7%' },
  ];

  return (
    <DashboardLayout 
      title="Attendance Report" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="card-box" style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
        <h4>Generate Attendance Report</h4>
        <div className="form-grid" style={{ marginTop: '1rem' }}>
          <div className="form-group"><label className="form-label">From Date</label><input className="form-input" type="date" defaultValue="2026-04-01" /></div>
          <div className="form-group"><label className="form-label">To Date</label><input className="form-input" type="date" defaultValue="2026-04-16" /></div>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-teal">Download CSV</button>
          <button className="btn btn-ghost">Download Excel</button>
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Attendance Summary</span></div>
        <table>
          <thead>
            <tr><th>Name</th><th>Present</th><th>Absent</th><th>Late</th><th>%</th></tr>
          </thead>
          <tbody>
            {summary.map((s, idx) => (
              <tr key={idx}>
                <td>{s.name}</td>
                <td>{s.present}</td>
                <td>{s.absent}</td>
                <td>{s.late}</td>
                <td style={{ fontFamily: 'var(--mono)' }}>{s.percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ReportAtt;
