import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Holidays = () => {
  const holidays = [
    { name: 'Ram Navami', date: '6 Apr 2026', day: 'Monday' },
    { name: 'Mahavir Jayanti', date: '10 Apr 2026', day: 'Friday' },
    { name: 'Independence Day', date: '15 Aug 2026', day: 'Saturday' },
    { name: 'Diwali', date: '20 Oct 2026', day: 'Tuesday' },
    { name: 'Christmas', date: '25 Dec 2026', day: 'Friday' },
  ];

  return (
    <DashboardLayout 
      title="Holidays" 
      role="user" 
      label="Employee" 
      abbr="EM" 
      color="#f59e0b" 
      bgColor="rgba(245,158,11,0.15)"
    >
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Company Holidays 2026</span></div>
        <table>
          <thead>
            <tr><th>Holiday</th><th>Date</th><th>Day</th></tr>
          </thead>
          <tbody>
            {holidays.map((h, idx) => (
              <tr key={idx}>
                <td>{h.name}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{h.date}</td>
                <td>{h.day}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Holidays;
