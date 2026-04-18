import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/Badge';

const Devices = () => {
  const devices = [
    { id: 'FP-001', name: 'Main Gate Scanner', loc: 'Entrance', sync: '2 min ago', status: 'online' },
    { id: 'FP-002', name: 'HR Floor Scanner', loc: '2nd Floor', sync: '5 min ago', status: 'online' },
    { id: 'FP-003', name: 'Cafeteria Reader', loc: 'Ground Floor', sync: '4 hrs ago', status: 'offline' },
  ];

  return (
    <DashboardLayout 
      title="Devices" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="table-wrap">
        <div className="table-header"><span className="table-title">Biometric Devices</span></div>
        <table>
          <thead>
            <tr><th>Device ID</th><th>Name</th><th>Location</th><th>Last Sync</th><th>Status</th></tr>
          </thead>
          <tbody>
            {devices.map(d => (
              <tr key={d.id}>
                <td style={{ fontFamily: 'var(--mono)' }}>{d.id}</td>
                <td>{d.name}</td>
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
