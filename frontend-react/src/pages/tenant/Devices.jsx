import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';

const Devices = () => {
  const devices = [
    { id: 'FP-001', dept: 'Engineering', loc: 'Main Gate', sync: '2 min ago', status: 'online' },
    { id: 'FP-002', dept: 'Engineering', loc: 'HR Floor', sync: '5 min ago', status: 'online' },
    { id: 'FP-007', dept: 'Ops', loc: 'Server Room', sync: '3 hrs ago', status: 'offline' },
    { id: 'FP-012', dept: 'Finance', loc: 'Lobby', sync: '8 min ago', status: 'online' },
  ];

  return (
    <DashboardLayout 
      title="Devices (Global)" 
      role="superadmin" 
      label="Tenant Admin" 
      abbr="TA" 
      color="#a855f7" 
      bgColor="rgba(168,85,247,0.15)"
    >
      <div className="stats-grid">
        <div className="stat-card teal"><div className="stat-label">Total Devices</div><div className="stat-value">312</div></div>
        <div className="stat-card green"><div className="stat-label">Online</div><div className="stat-value">306</div></div>
        <div className="stat-card red"><div className="stat-label">Offline</div><div className="stat-value">6</div></div>
      </div>
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Device Registry</span></div>
        <table>
          <thead>
            <tr><th>Device ID</th><th>Department</th><th>Location</th><th>Last Sync</th><th>Status</th></tr>
          </thead>
          <tbody>
            {devices.map(d => (
              <tr key={d.id}>
                <td style={{ fontFamily: 'var(--mono)' }}>{d.id}</td>
                <td>{d.dept}</td>
                <td>{d.loc}</td>
                <td style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem' }}>{d.sync}</td>
                <td><Badge type={d.status}>{d.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Devices;
