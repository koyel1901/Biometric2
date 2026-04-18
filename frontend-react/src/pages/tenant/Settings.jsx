import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Settings = () => {
  return (
    <DashboardLayout 
      title="System Settings" 
      role="superadmin" 
      label="Tenant Admin" 
      abbr="TA" 
      color="#a855f7" 
      bgColor="rgba(168,85,247,0.15)"
    >
      <div className="card-box" style={{ maxWidth: '600px' }}>
        <h4>System Settings</h4>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Session Timeout (mins)</label><input className="form-input" defaultValue="30" /></div>
          <div className="form-group"><label className="form-label">Sync Interval (seconds)</label><input className="form-input" defaultValue="60" /></div>
          <div className="form-group"><label className="form-label">Max Login Attempts</label><input className="form-input" defaultValue="5" /></div>
          <button className="btn btn-teal" style={{ width: 'fit-content', marginTop: '0.5rem' }}>Save Settings</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
