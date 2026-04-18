import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const Settings = () => {
  return (
    <DashboardLayout 
      title="Settings" 
      role="orgadmin" 
      label="Department Admin" 
      abbr="DA" 
      color="#00d4aa" 
      bgColor="rgba(0,212,170,0.15)"
    >
      <div className="card-box" style={{ maxWidth: '500px' }}>
        <h4>Organisation Settings</h4>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Office Start Time</label><input className="form-input" type="time" defaultValue="09:00" /></div>
          <div className="form-group"><label className="form-label">Office End Time</label><input className="form-input" type="time" defaultValue="18:00" /></div>
          <div className="form-group"><label className="form-label">Late Threshold (mins after start)</label><input className="form-input" type="number" defaultValue="15" /></div>
          <div className="form-group"><label className="form-label">Minimum Working Hours</label><input className="form-input" type="number" defaultValue="8" /></div>
          <button className="btn btn-teal" style={{ width: 'fit-content' }}>Save Settings</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
