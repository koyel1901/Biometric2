import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';

const Attendance = () => {
  const attendance = [
    { date: '16 Apr', in: '09:05', out: '--', hours: '--', status: 'present' },
    { date: '15 Apr', in: '09:15', out: '18:01', hours: '8h 46m', status: 'late' },
    { date: '14 Apr', in: '09:05', out: '18:02', hours: '8h 57m', status: 'present' },
    { date: '13 Apr', in: '--', out: '--', hours: '--', status: 'absent' },
    { date: '12 Apr', in: '08:58', out: '18:00', hours: '9h 02m', status: 'present' },
  ];

  return (
    <DashboardLayout 
      title="Attendance List" 
      role="user" 
      label="Employee" 
      abbr="EM" 
      color="#f59e0b" 
      bgColor="rgba(245,158,11,0.15)"
    >
      <div className="table-wrap">
        <div className="table-header">
          <span className="table-title">My Attendance</span>
          <select className="form-select" style={{ width: '130px', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
            <option>April 2026</option>
            <option>March 2026</option>
          </select>
        </div>
        <table>
          <thead>
            <tr><th>Date</th><th>Check-in</th><th>Check-out</th><th>Working Hours</th><th>Status</th></tr>
          </thead>
          <tbody>
            {attendance.map((a, idx) => (
              <tr key={idx}>
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
