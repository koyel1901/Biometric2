import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Activity = () => {
  const activity = [
    { time: '09:15 AM', event: 'Employee EMP-001 attendance marked (IN)', actor: 'System' },
    { time: '09:31 AM', event: 'Late attendance recorded — Sneha Patel', actor: 'System' },
    { time: '10:05 AM', event: 'Leave request approved — Rahul Sharma', actor: 'Org Admin' },
    { time: '11:30 AM', event: 'Manual entry added for EMP-002', actor: 'Org Admin' },
    { time: '02:00 PM', event: 'Employee EMP-006 deactivated', actor: 'Org Admin' },
  ];

  return (
    <DashboardLayout 
      title="Activity Log" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Activity Log</span></div>
        <table>
          <thead>
            <tr><th>Time</th><th>Event</th><th>By</th></tr>
          </thead>
          <tbody>
            {activity.map((a, idx) => (
              <tr key={idx}>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{a.time}</td>
                <td>{a.event}</td>
                <td>{a.actor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
