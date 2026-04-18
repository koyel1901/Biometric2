import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';

const Attendance = () => {
  const attendance = [
    { name: 'Aarav Kumar', date: '17 Apr', in: '09:02', out: '18:05', hours: '9h 03m', status: 'present' },
    { name: 'Priya Mehta', date: '17 Apr', in: '--', out: '--', hours: '--', status: 'absent' },
    { name: 'Sneha Patel', date: '17 Apr', in: '09:31', out: '18:10', hours: '8h 39m', status: 'late' },
    { name: 'Vikram Nair', date: '17 Apr', in: '08:58', out: '18:02', hours: '9h 04m', status: 'present' },
  ];

  return (
    <DashboardLayout 
      title="Attendance List" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">Attendance List</span>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input className="tb-search" placeholder="Search employee..." style={{ width: '160px' }} />
            <select className="form-select" style={{ width: '110px', padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>
              <option>All Status</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
            </select>
            <input 
              type="date" 
              className="form-input" 
              defaultValue={new Date().toISOString().split('T')[0]} 
              style={{ width: '130px', padding: '0.4rem', fontSize: '0.8rem', background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px' }} 
            />
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Employee</th><th>Date</th><th>Check-in</th><th>Check-out</th><th>Hours</th><th>Status</th></tr>
          </thead>
          <tbody>
            {attendance.map((a, idx) => (
              <tr key={idx}>
                <td>{a.name}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.date}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.in}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.out}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.hours}</td>
                <td><Badge type={a.status}>{a.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
